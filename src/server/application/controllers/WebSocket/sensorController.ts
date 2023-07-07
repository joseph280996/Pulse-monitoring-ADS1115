/* eslint-disable no-await-in-loop*/
import dotenv from 'dotenv'
import WS_MESSAGE_TYPE from '../../../infrastructure/variables/wsMessageType'
import SensorDataServiceFactory from '../../../domain/factories/sensorDataServiceFactory'
import TimeIntervalService from '../../../infrastructure/services/TimeIntervalService'
import WebSocket, { RawData } from 'ws'
import ISensorService from '../../../domain/interfaces/ISensorService'
import wsOperationTypes from '../../../infrastructure/variables/wsOperationTypes'

dotenv.config()
class SensorController {
  //#region Private Properties
  private static _instance: SensorController
  private factoryInitPromise: Promise<any>
  //#endregion

  //#region Constructors
  constructor(
    private sensorServiceFactory: SensorDataServiceFactory = SensorDataServiceFactory.instance,
    private intervalService: TimeIntervalService = TimeIntervalService.instance,
  ) {
    this.factoryInitPromise = sensorServiceFactory.init()
  }
  //#endregion

  //#region Public Methods
  public static get instance() {
    if (!SensorController._instance) {
      SensorController._instance = new SensorController()
    }
    return SensorController._instance
  }

  public router(rawMessage: RawData, ws: WebSocket) {
    const message = rawMessage.toString()
    const [operation, data] = message.split(';')
    console.log(`Received event to [${operation}] with data [${data}]`)

    switch (operation) {
      case wsOperationTypes.START:
        this.start(data, ws)
        break
      case wsOperationTypes.STOP:
        this.stop(data, ws)
        break
      case wsOperationTypes.RESUME:
        this.resume()
        break
      case wsOperationTypes.PAUSE:
        this.pause()
        break
      default:
        this.stop(data, ws)
    }
  }

  public async start(_: string, ws: WebSocket) {
    await this.factoryInitPromise
    const service = this.sensorServiceFactory.getService()

    // Initialize service to create diagnosis
    await service.init()
    service.start()
    this.sendData(ws, service)
  }

  public async pause() {
    await this.factoryInitPromise
    const service = this.sensorServiceFactory.getService()
    service.pause()
  }

  public async resume() {
    await this.factoryInitPromise
    const service = this.sensorServiceFactory.getService()
    service.resume()
  }

  public async stop(_: string, ws: WebSocket) {
    await this.factoryInitPromise
    const service = this.sensorServiceFactory.getService()
    service.stop()
    this.intervalService.clear(service.name)
    ws.send(
      JSON.stringify({
        diagnosisId: service.diagnosisId,
      }),
    )
  }
  //#endregion

  //#region Private Methods
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
  //#endregion
}

export default SensorController
