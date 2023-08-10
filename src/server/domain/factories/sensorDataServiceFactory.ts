import dotenv from 'dotenv'
import SensorServiceBase from '../services/SensorServiceBase';

class SensorDataServiceFactory {
  //#region Properties
  private static _instance: SensorDataServiceFactory
  private service!: SensorServiceBase
  //#endregion

  //#region getters
  static get instance(): Promise<SensorDataServiceFactory> {
    dotenv.config()
    const importPath = process.env.RUNNING_ENV === 'development' ? '../services/SensorMockService' : '../services/PiezoElectricSensorService'
    return import(importPath).then((service:SensorServiceBase) => {
      if (!SensorDataServiceFactory._instance) {
        SensorDataServiceFactory._instance = new SensorDataServiceFactory(service)
      }
      return SensorDataServiceFactory._instance
    })
  }
  //#endregion

  //#region Constructor
  constructor(sensorService: SensorServiceBase) {
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
