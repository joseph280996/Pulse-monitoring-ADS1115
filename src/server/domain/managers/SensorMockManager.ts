import moment from 'moment'
import RecordInstance from '../models/RecordInstance'
import SensorServiceBase from './SensorManagerBase'

class SensorMockService extends SensorServiceBase {
  //#region Properties
  get name() {
    return this.SERVICE_NAME
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
