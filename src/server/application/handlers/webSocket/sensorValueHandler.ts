import WebSocket from 'ws'
import IntervalService from '../../../infrastructure/services/TimeIntervalService'
import WS_MESSAGE_TYPE from '../../../infrastructure/variables/wsMessageType'
import SensorServiceFactory from '../../../domain/factories/sensorDataServiceFactory'
import ISensorService from '../../../domain/interfaces/ISensorService'

//#region properties
const serviceFactory = SensorServiceFactory.instance
const factoryInitPromise = serviceFactory.init()
const intervalService = IntervalService.instance
//#endregion

//#region public methods
/**
 * Handler to start getting and sending value from the sensor
 * @param _ WS message
 * @param ws WS instance
 */
export const startSendingSensorValueLoop = async (_: string, ws: WebSocket) => {
  await factoryInitPromise
  const service = serviceFactory.getService()

  // Initialize service to create diagnosis
  await service.init()
  service.start()
  sendData(ws, service)
}

export const stopGetSensorValueLoop = async (_: string, ws: WebSocket) => {
  await factoryInitPromise
  const service = serviceFactory.getService()
  service.stop()
  intervalService.clear(service.name)
  ws.send(
    JSON.stringify({
      type: WS_MESSAGE_TYPE.RECORD_ID,
    }),
  )
}
//#endregion

//#region private methods
const sendSingleBatchData = (ws: WebSocket, service: ISensorService) => () => {
  const singleBatchData = service.getSingleBatchData()
  ws.send(
    JSON.stringify({
      type: WS_MESSAGE_TYPE.RECORDED_DATA,
      recordedData: singleBatchData,
    }),
  )
}

const sendData = async (ws: WebSocket, service: ISensorService) => {
  try {
    console.log('Registering interval to send data every cycle')
    const sendDataInterval = setInterval(sendSingleBatchData(ws, service), 200)
    intervalService.registerInterval(service.name, sendDataInterval)
  } catch (error) {
    console.error(error)
  }
}
//#endregion
