import moment from 'moment'
import { RecordedData } from 'src/server/application/handlers/webSocket/sensorValueHandler.types'
import LoopService from '../../infrastructure/services/LoopService'
import getLastNElementsFromRecordedData from '../../infrastructure/utils/functions/getLastNElementsFromRecordedData'
import Diagnosis from '../models/Diagnosis'
import DiagnosisRepository from '../repositories/DiagnosisRepository'
import RecordRepository from '../repositories/RecordRepository'

class SensorMockService {
  //#region properties
  private static _instance: SensorMockService

  private readonly SERVICE_NAME = 'mockSensorService'
  private readonly BATCH_DATA_SIZE = 20

  private readonly loopService: LoopService = new LoopService()

  private store: RecordedData[] = []
  private secondaryStore: RecordedData[] = []

  private diagnosis: Diagnosis | null = null

  private diagnosisRepo!: DiagnosisRepository
  private recordRepo!: RecordRepository
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
  constructor() {
    this.diagnosisRepo = DiagnosisRepository.instance
    this.recordRepo = RecordRepository.instance
  }
  //#endregion

  //#region public methods
  async init() {
    try {
      this.diagnosis = await this.diagnosisRepo.create({})
    } catch (err) {
      throw new Error(`Failed to create Diagnosis: ${(err as Error).message}`)
    }
  }

  // Start Reading Values from Sensor
  start() {
    this.loopService.start()
    ;(async () => {
      while (this.loopService.isStarted) {
        // When store length is 1000, swap the secondary store to use
        if (this.store.length === 200) {
          console.log('Switching Store')
          this.swapStore()
        }

        // When length of main data storage big enough to maintain on its own,
        // we save reset secondary
        if (
          this.store.length > this.BATCH_DATA_SIZE &&
          this.secondaryStore.length > 0
        ) {
          console.log('Begin saving Record')
          await this.recordRepo.create({
            data: this.secondaryStore,
            diagnosisID: this.diagnosis?.id as number,
          })
          console.log('Finish Saving Record')
          this.secondaryStore = []
        }

        const dataWithDateTime = await this.readData()
        this.store.push(dataWithDateTime)
      }
    })()
  }

  stop() {
    this.loopService.stop()
  }

  getSingleBatchData() {
    if (
      this.store.length < this.BATCH_DATA_SIZE &&
      this.secondaryStore.length > 0
    ) {
      return getLastNElementsFromRecordedData(
        [...this.store, ...this.secondaryStore],
        this.BATCH_DATA_SIZE,
      )
    }
    return getLastNElementsFromRecordedData(this.store, this.BATCH_DATA_SIZE)
  }
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

  private async readData(): Promise<RecordedData> {
    const data: number = await this.getMockData()
    return {
      timeStamp: moment.utc().valueOf(),
      data,
    }
  }

  private swapStore() {
    const temp = this.store
    this.store = this.secondaryStore
    this.secondaryStore = temp
  }
  //#endregion
}

export default SensorMockService
