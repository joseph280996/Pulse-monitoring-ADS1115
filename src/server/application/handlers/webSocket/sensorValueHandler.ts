import WebSocket from 'ws'
import IntervalController from '../../../infrastructure/services/TimeIntervalService'
import WS_MESSAGE_TYPE from '../../../infrastructure/variables/wsMessageType'
import SensorServiceFactory from '../../../domain/factories/sensorDataServiceFactory'

//#region properties
const serviceFactory = SensorServiceFactory.instance
const getServicePromise = serviceFactory.getService()
//#endregion

//#region public methods
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
//#endregion

//#region private methods
const sendData = async (ws: WebSocket) => {
  const service = await getServicePromise
  try {
    const singleBatchData = service.getSingleBatchData()
    const sendDataInterval = setInterval(() => {
      console.log(`Begin sending batch of [${singleBatchData.length}] data`)
      ws.send(
        JSON.stringify({
          type: WS_MESSAGE_TYPE.RECORDED_DATA,
          recordedData: singleBatchData,
        }),
      )
    }, 200)

    IntervalController.registerInterval(service.name, sendDataInterval)
  } catch (error) {
    console.error(error)
  } finally {
    IntervalController.clear(service.name)
  }
}
//#endregion
