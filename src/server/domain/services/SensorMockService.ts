import moment from 'moment'
import Record from '../models/Record'
import SensorServiceBase from './SensorServiceBase'

class SensorMockService extends SensorServiceBase {
  //#region properties
  private static _instance: SensorMockService
  //#endregion

  //#region getters
  get name() {
    return this.SERVICE_NAME
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new SensorMockService()
    }

    return this._instance
  }
  //#endregion

  //#region constructor
  constructor(
    private readonly SERVICE_NAME = 'mockSensorService'
  ) {
    super()
  }
  //#endregion

  //#region public methods
  override async init() {
    this.diagnosis = await this.diagnosisRepo.create({})
  }

  // Start Reading Values from Sensor
  //#endregion

  //#region private methods
  private async getMockData(): Promise<number> {
    const promise = new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(Math.random())
      }, 5)
    })
    return promise
  }

  override async readADS1115Value(): Promise<Record> {
    const data: number = await this.getMockData()
    return new Record(
      moment.utc().valueOf(),
      data,
    )
  }
  //#endregion
}

export default SensorMockService
