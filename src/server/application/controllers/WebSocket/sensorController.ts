/* eslint-disable no-await-in-loop*/
import dotenv from 'dotenv'
import WS_MESSAGE_TYPE from '../../../infrastructure/variables/wsMessageType'
import * as sensorHandler from '../../handlers/webSocket/sensorValueHandler'
import SensorDataServiceFactory from 'src/server/domain/factories/sensorDataServiceFactory'
import TimeIntervalService from 'src/server/infrastructure/services/TimeIntervalService'
import WebSocket, { RawData } from 'ws'
import ISensorService from 'src/server/domain/interfaces/ISensorService'

dotenv.config()
class SensorController {
  private static _instance: SensorController
  private factoryInitPromise: Promise<any>

  public static get instance() {
    if (!SensorController._instance) {
      SensorController._instance = new SensorController()
    }
    return SensorController._instance
  }

  constructor(
    private sensorServiceFactory: SensorDataServiceFactory = SensorDataServiceFactory.instance,
    private intervalService: TimeIntervalService = TimeIntervalService.instance,
  ) {
    this.factoryInitPromise = sensorServiceFactory.init()
  }

  public router(rawMessage: RawData){
        const message = rawMessage.toString()
        const [operation, data] = message.split(';')
        console.log(`Received event to [${operation}] with data [${data}]`)
        const handler = [operation]
        handler(data, ws)

  }

  public async start(_: string, ws: WebSocket) {
    await this.factoryInitPromise
    const service = this.sensorServiceFactory.getService()

    // Initialize service to create diagnosis
    await service.init()
    service.start()
    this.sendData(ws, service)
  }

  public async stop(_: string, ws: WebSocket) {
    await this.factoryInitPromise
    const service = this.sensorServiceFactory.getService()
    service.stop()
    this.intervalService.clear(service.name)
    ws.send(
      JSON.stringify({
        type: WS_MESSAGE_TYPE.RECORD_ID,
      }),
    )
  }

  private async sendData(ws: WebSocket, service: ISensorService) {
    try {
      console.log('Registering interval to send data every cycle')
      const sendDataInterval = setInterval(
        this.sendSingleBatchData(ws, service),
        200,
      )
      this.intervalService.registerInterval(service.name, sendDataInterval)
    } catch (error) {
      console.error(error)
    }
  }

  private sendSingleBatchData(ws: WebSocket, service: ISensorService) {
    return () => {
      const singleBatchData = service.getSingleBatchData()
      ws.send(
        JSON.stringify({
          type: WS_MESSAGE_TYPE.RECORDED_DATA,
          recordedData: singleBatchData,
        }),
      )
    }
  }
}

export default SensorController
