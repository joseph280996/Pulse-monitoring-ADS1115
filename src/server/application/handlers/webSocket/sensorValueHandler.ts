import WebSocket from 'ws'
import IntervalController from 'src/server/infrastructure/services/TimeIntervalService'
import WS_MESSAGE_TYPE from 'src/server/infrastructure/variables/wsMessageType'
import PiezoElectricSensorService from 'src/server/domain/services/PiezoElectricSensorService'

const piezoSensorService = PiezoElectricSensorService.instance

const sendData = (ws: WebSocket) => {
  try {
    const singleBatchData = piezoSensorService.getSingleBatchData()
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

// TODO: Decide what to do with the stop handler
// const getRecords = async (): Promise<Record[]> => {
//   const records = await recordRepo.getByDiagnosisID(PiezoElectricSensorService.diagnosisID)

//   if (records.length === 0) {
//     throw new Error(`Can't find records with diagnosis ID [${PiezoElectricSensorService.diagnosisID}]`)
//   }
//   return records
// }

// const getRecordedData = (records, startTime, endTime) => {
//   const recordedData = records.flat().map((record: Record) => record.data)
//   return getRecordedDataBetweenTimeStamp(
//     recordedData,
//     startTime,
//     endTime,
//   )
// }
//
// const enrichMessage = (message: string): EnrichedStopRequestData => {
//   const trimmedJSONValues = message.trim()
//   const parsedRecordedTime: StopGetSensorValueLoopRequestData =
//     JSON.parse(trimmedJSONValues)
//   const { startTime, endTime, handPositionID } = parsedRecordedTime
//   return {
//     startTime: moment.utc(startTime),
//     endTime: moment.utc(endTime),
//     handPositionID,
//   }
// }

/**
 * Handler to start getting and sending value from the sensor
 * @param _ WS message
 * @param ws WS instance
 */
export const startSendingSensorValueLoop = async (_: string, ws: WebSocket) => {
  await piezoSensorService.init()
  piezoSensorService.start()
  sendData(ws)
}

export const stopGetSensorValueLoop = async (_: string, ws: WebSocket) => {
  piezoSensorService.stop()
  IntervalController.clear(PiezoElectricSensorService.name)
  ws.send(
    JSON.stringify({
      type: WS_MESSAGE_TYPE.RECORD_ID,
    }),
  )
}
