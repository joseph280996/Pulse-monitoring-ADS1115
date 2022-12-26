import moment from 'moment'
import { RecordedData } from 'src/server/application/handlers/webSocket/sensorValueHandler.types'
import LoopService from '../../infrastructure/services/LoopService'
import getLastNElementsFromRecordedData from '../../infrastructure/utils/functions/getLastNElementsFromRecordedData'
import Diagnosis from '../models/Diagnosis'
import Record from '../models/Record'
import DiagnosisRepository from '../repositories/DiagnosisRepository'
import RecordRepository from '../repositories/RecordRepository'

class SensorMockService {
  private static _instance: SensorMockService

  private readonly SERVICE_NAME = 'mockSensorService'
  private readonly BATCH_DATA_SIZE = 20

  private readonly loopService: LoopService = new LoopService()

  private store: RecordedData[] = []
  private secondaryStore: RecordedData[] = []

  private saveRecordPromise: Promise<Record> | null = null
  private diagnosis: Diagnosis | null = null

  private diagnosisRepo!: DiagnosisRepository
  private recordRepo!: RecordRepository

  get name() {
    return this.SERVICE_NAME
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new SensorMockService()
    }

    return this._instance
  }

  constructor() {
    this.diagnosisRepo = DiagnosisRepository.instance
    this.recordRepo = RecordRepository.instance
  }

  async init() {
    this.diagnosis = await this.diagnosisRepo.create({})
  }

  // Start Reading Values from Sensor
  start() {
    this.loopService.start()
      ; (async () => {
        while (this.loopService.isStarted) {
          // When store length is 1000, swap the secondary store to use
          if (this.store.length === 1000) {
            this.swapStore()
            this.saveRecordPromise = this.recordRepo.create({
              data: this.secondaryStore,
              diagnosisID: this.diagnosis?.id as number,
            })
          }

          // When length of main data storage big enough to maintain on its own,
          // we save reset secondary
          if (
            this.store.length > this.BATCH_DATA_SIZE &&
            this.saveRecordPromise
          ) {
            await this.saveRecordPromise
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

  private async getMockData(): Promise<number> {
    const promise = new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(Math.random())
      }, 50)
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
}

export default SensorMockService
