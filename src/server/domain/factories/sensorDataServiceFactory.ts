import dotenv from 'dotenv'
import ISensorService from '../interfaces/ISensorService'

class SensorDataServiceFactory {

  //#region properties
  private static _instance: SensorDataServiceFactory
  private runningEnv!: string
  private service!: ISensorService
  //#endregion

  //#region getters
  static get instance() {
    dotenv.config()
    if (!this._instance && process.env.RUNNING_ENV) {
      this._instance = new SensorDataServiceFactory(process.env.RUNNING_ENV)
    }
    return this._instance
  }
  //#endregion

  //#region constructor
  constructor(runningEnv: string) {
    this.runningEnv = runningEnv
  }
  //#endregion

  //#region public methods
  async init() {
    let serviceImport
    if (this.runningEnv === 'development') {
      serviceImport = await import('../services/SensorMockService')
    } else {
      serviceImport = await import('../services/PiezoElectricSensorService')
    }
    this.service = serviceImport.default.instance
  }

  getService() {
    if (!this.service) {
      throw new Error('Please call init() before calling getService().')
    }
    return this.service
  }
  //#endregion
}

export default SensorDataServiceFactory
