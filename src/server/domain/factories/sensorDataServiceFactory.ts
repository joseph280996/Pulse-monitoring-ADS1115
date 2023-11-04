import dotenv from 'dotenv'
import ISensorService from '../interfaces/ISensorService'

class SensorDataServiceFactory {
  //#region Public Methods
  static async getService(): Promise<ISensorService> {
    dotenv.config()
    const importPath =
      process.env.RUNNING_ENV === 'development'
        ? '../managers/SensorManagerBase.ts'
        : '../managers/PiezoElectricSensorManager'
    console.log(`Importing ${importPath}`)
    return import(importPath).then((module) => {
      return module.instance
    })
  }
  //#endregion
}

export default SensorDataServiceFactory
