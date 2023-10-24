/* eslint-disable no-await-in-loop*/
import dotenv from 'dotenv'
import WS_MESSAGE_TYPE from '../../../infrastructure/variables/wsMessageType'
import SensorDataServiceFactory from '../../../domain/factories/sensorDataServiceFactory'
import TimeIntervalService from '../../../infrastructure/services/TimeIntervalService'
import WebSocket, { RawData } from 'ws'
import ISensorService from '../../../domain/interfaces/ISensorService'
import wsOperationTypes from '../../../infrastructure/variables/wsOperationTypes'
import { messageValidator } from '../../validators/websocketMessages/websocketMessageValidator'

dotenv.config()

/**
 * Sensor Value Websocket Controller
 *
 * List of all the possible operation can be performed on the sensor data:
 *  1. Start
 *  2. Stop
 *  3. Resume
 *  4. Pause
 */
class SensorController {
  //#region Private Properties
  private static _instance: SensorController
  //#endregion

  //#region Constructors
  private constructor(
    private sensorServiceFactoryPromise: Promise<SensorDataServiceFactory> = SensorDataServiceFactory.instance,
    private intervalService: TimeIntervalService = TimeIntervalService.instance,
  ) {
    if (SensorController._instance) {
      throw new Error(
        'This is a singleton class. Called instance property instead of initializing a new instance',
      )
    }
  }
  //#endregion

  //#region Public Methods
  public static get instance() {
    if (!SensorController._instance) {
      SensorController._instance = new SensorController()
    }

    return SensorController._instance
  }

  /**
   * The router registration that will perform action based on receiving message
   */
  public router(rawMessage: RawData, ws: WebSocket) {
    const message = rawMessage.toString()
    const [operation, data] = messageValidator(message)

    console.log(
      `Started executing operation [${operation}] with data [${data}]`,
    )
    console.log(
      `Started executing operation [${operation}] with data [${data}]`,
    )

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

  /**
   * Initialize the sensor reading and sensor communication loop
   */
  public async start(_: string, ws: WebSocket) {
    const service = await SensorDataServiceFactory.getService()

    // Initialize service to create diagnosis
    await service.init()
    service.start()
    this.sendData(ws, service)
  }

  /**
   * Pause the current reading sensor reading and sending data loop
   */
  public async pause() {
    const service = await SensorDataServiceFactory.getService()
    this.intervalService.clear(service.name)
    service.pause()
  }

  /**
   * Resume the reading sensor and sending data loop
   */
  public async resume() {
    const service = await SensorDataServiceFactory.getService()
    service.resume()
  }

  /**
   * Stop the reading sensor and sending data loop
   */
  public async stop(_: string, ws: WebSocket) {
    const service = await SensorDataServiceFactory.getService()
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
