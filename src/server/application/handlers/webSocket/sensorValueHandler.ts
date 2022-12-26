import WebSocket from 'ws'
import IntervalController from '../../../infrastructure/services/TimeIntervalService'
import WS_MESSAGE_TYPE from '../../../infrastructure/variables/wsMessageType'
import SensorServiceFactory from '../../../domain/factories/sensorDataServiceFactory'

const serviceFactory = SensorServiceFactory.instance
const getServicePromise = serviceFactory.getService()

const sendData = async (ws: WebSocket) => {
  const service = await getServicePromise
  try {
    const singleBatchData = service.getSingleBatchData()
    const sendDataInterval = setInterval(() => {
      ws.send(
        JSON.stringify({
          type: WS_MESSAGE_TYPE.RECORDED_DATA,
          recordedData: singleBatchData,
        }),
      )
    }, 200)

    IntervalController.registerInterval(
      service.name,
      sendDataInterval,
    )
  } catch (error) {
    console.error(error)
  } finally {
    IntervalController.clear(service.name)
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
  const service = await getServicePromise
  await service.init()
  service.start()
  sendData(ws)
}

export const stopGetSensorValueLoop = async (_: string, ws: WebSocket) => {
  const service = await getServicePromise
  service.stop()
  IntervalController.clear(service.name)
  ws.send(
    JSON.stringify({
      type: WS_MESSAGE_TYPE.RECORD_ID,
    }),
  )
}
