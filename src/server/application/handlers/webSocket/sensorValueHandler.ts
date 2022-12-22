import moment from 'moment'
import WebSocket from 'ws'
import IntervalController from 'src/server/infrastructure/services/TimeIntervalService'
import RecordRepository from 'src/server/domain/repositories/RecordRepository'
import getRecordedDataBetweenTimeStamp from 'src/server/infrastructure/utils/functions/getRecordedDataBetweenTimeStamp'
import WS_MESSAGE_TYPE from 'src/server/infrastructure/variables/wsMessageType'
import {
  EnrichedStopRequestData,
  RecordedData,
  StopGetSensorValueLoopRequestData,
} from './sensorValueHandler.types'
import PiezoElectricSensorService from 'src/server/domain/services/PiezoElectricSensorService'

const enrichMessage = (message: string): EnrichedStopRequestData => {
  const trimmedJSONValues = message.trim()
  const parsedRecordedTime: StopGetSensorValueLoopRequestData =
    JSON.parse(trimmedJSONValues)
  const { startTime, endTime, handPositionID } = parsedRecordedTime
  return {
    startTime: moment.utc(startTime),
    endTime: moment.utc(endTime),
    handPositionID,
  }
}

const sendData = (ws: WebSocket) => {
  try {
    const singleBatchData = PiezoElectricSensorService.getSingleBatchData()
    const sendDataInterval = setInterval(() => {
      ws.send(
        JSON.stringify({
          type: WS_MESSAGE_TYPE.RECORDED_DATA,
          recordedData: singleBatchData,
        }),
      )
    }, 200)

    IntervalController.registerInterval(
      PiezoElectricSensorService.name,
      sendDataInterval,
    )
  } catch (error) {
    console.error(error)
  } finally {
    IntervalController.clear(PiezoElectricSensorService.name)
  }
}

/**
 * Handler to start getting and sending value from the sensor
 * @param _ WS message
 * @param ws WS instance
 */
export const startSendingSensorValueLoop = async (_: string, ws: WebSocket) => {
  await PiezoElectricSensorService.init()
  PiezoElectricSensorService.start()
  sendData(ws)
}


export const stopGetSensorValueLoop = async (
  message: string,
  ws: WebSocket,
) => {
  IntervalController.clear(PiezoElectricSensorService.name)
  const { startTime, endTime, handPositionID } = enrichMessage(message)
  const recordedValues: RecordedData[] = getRecordedDataBetweenTimeStamp(
    store,
    startTime,
    endTime,
  )

  const newRecord = await RecordRepository.create({
    data: recordedValues,
    handPositionID,
  })

  if (!newRecord) {
    throw new Error('Error create piezoelectric record')
  }

  store = [[]]
  ws.send(
    JSON.stringify({
      type: WS_MESSAGE_TYPE.RECORD_ID,
      recordID: newRecord.id,
    }),
  )
}

