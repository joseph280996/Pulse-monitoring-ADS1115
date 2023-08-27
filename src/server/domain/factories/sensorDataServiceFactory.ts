import dotenv from 'dotenv'
import SensorManagerBase from '../managers/SensorManagerBase';

class SensorDataServiceFactory {
  //#region Public Methods
  static async getService() {
    dotenv.config()
    const importPath = process.env.RUNNING_ENV === 'development' ? '../services/SensorMockService' : '../services/PiezoElectricSensorService'
    return import(importPath).then((service:SensorManagerBase) => {
      return service;
    })
  }
  //#endregion
}

export default SensorDataServiceFactory
