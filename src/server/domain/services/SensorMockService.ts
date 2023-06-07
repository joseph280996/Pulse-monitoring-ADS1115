import moment from 'moment'
import RecordInstance from '../models/RecordInstance'
import SensorServiceBase from './SensorServiceBase'

class SensorMockService extends SensorServiceBase {
  //#region Properties
  get name() {
    return this.SERVICE_NAME
  }

  private static _instance: SensorMockService
  static get instance() {
    if (!this._instance) {
      this._instance = new SensorMockService()
    }

    return this._instance
  }
  //#endregion

  //#region Constructor
  constructor(private readonly SERVICE_NAME = 'mockSensorService') {
    super()
  }
  //#endregion

  //#region Private Methods
  private async getMockData(): Promise<number> {
    const promise = new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(Math.random())
      }, 5)
    })
    return promise
  }

  override async readADS1115Value(): Promise<RecordInstance> {
    const data: number = await this.getMockData()
    return new RecordInstance(moment.utc().valueOf(), data)
  }
  //#endregion
}

export default SensorMockService
