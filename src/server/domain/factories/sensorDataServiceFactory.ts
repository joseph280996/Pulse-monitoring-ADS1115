import dotenv from 'dotenv'
import SensorManagerBase from '../managers/SensorManagerBase'

class SensorDataServiceFactory {
  //#region Properties
  private static _instance: SensorDataServiceFactory
  private service!: SensorManagerBase
  //#endregion

  //#region Public Methods
  static async getService() {
    dotenv.config()
    const importPath =
      process.env.RUNNING_ENV === 'development'
        ? '../services/SensorMockService'
        : '../services/PiezoElectricSensorService'
    return import(importPath).then((service: SensorManagerBase) => {
      if (!SensorDataServiceFactory._instance) {
        SensorDataServiceFactory._instance = new SensorDataServiceFactory(
          service,
        )
      }
      return SensorDataServiceFactory._instance
    })
  }
  //#endregion

  //#region Constructor
  constructor(sensorService: SensorManagerBase) {
    if (SensorDataServiceFactory._instance) {
      throw new Error(
        'This is a singleton class. Called instance property instead of initializing a new instance',
      )
    }

    this.service = sensorService
  }
  //#endregion

  //#region Public Methods
  getService() {
    if (!this.service) {
      throw new Error('Please call init() before calling getService().')
    }
    return this.service
  }
  //#endregion
}

export default SensorDataServiceFactory
