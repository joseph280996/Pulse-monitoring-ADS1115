import dotenv from 'dotenv'
import ISensorService from '../interfaces/ISensorService'

class SensorDataServiceFactory {
  private static _instance: SensorDataServiceFactory

  private runningEnv!: string
  private service!: ISensorService

  constructor(runningEnv: string) {
    this.runningEnv = runningEnv
  }

  static get instance() {
    dotenv.config()
    if (!this._instance && process.env.RUNNING_ENV) {
      this._instance = new SensorDataServiceFactory(process.env.RUNNING_ENV)
    }
    return this._instance
  }

  async getService() {
    if (this.service) {
      return this.service
    }
    let serviceImport
    if (this.runningEnv === 'development') {
      serviceImport = await import('../services/SensorMockService')
    } else {
      serviceImport = await import('../services/PiezoElectricSensorService')
    }
    this.service = serviceImport.default.instance
    return this.service
  }
}

export default SensorDataServiceFactory
