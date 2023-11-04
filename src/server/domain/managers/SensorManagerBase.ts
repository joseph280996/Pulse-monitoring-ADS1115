import LoopService from '../../infrastructure/services/LoopService'
import getLastNElementsFromRecordedData from '../../infrastructure/utils/functions/getLastNElementsFromRecordedData'
import DiagnosisRepository from '../repositories/DiagnosisRepository'
import Diagnosis from '../models/Diagnosis'
import ISensorService from '../interfaces/ISensorService'
import RecordInstance from '../models/RecordInstance'
import recordTypes from '../../infrastructure/variables/recordTypes'
import Record from '../models/Record'
import RecordRepository from '../repositories/RecordRepository'
import moment from 'moment'

class SensorServiceBase implements ISensorService {
  //#region Methods to override
  protected async readADS1115Value(): Promise<RecordInstance> {
    const data: number = await this.getMockData()
    return new RecordInstance(moment.utc().valueOf(), data)
  }

  //#endregion
  //#region Properties
  private static __instance: SensorServiceBase
  //#endregion
  //#region Constructor
  protected constructor(
    protected SERVICE_NAME: string = 'SensorServiceBase',
    protected diagnosisRepo: DiagnosisRepository = new DiagnosisRepository(),
    private recordRepo: RecordRepository = new RecordRepository(),
    private saveRecordPromise: Promise<Record> | null = null,
    protected diagnosis: Diagnosis | null = null,
    private store: RecordInstance[] = [],
    private secondaryStore: RecordInstance[] = [],
    private readonly BATCH_DATA_SIZE = 20,
    private readonly loopService: LoopService = new LoopService(),
  ) {}
  //#endregion

  //#region Pulic Methods
  static get instance() {
    if (!SensorServiceBase.instance) {
      SensorServiceBase.__instance = new SensorServiceBase()
    }
    return SensorServiceBase.__instance
  }

  public get name(): string {
    return this.SERVICE_NAME
  }

  get diagnosisId(): number {
    if (!this.diagnosis) {
      console.error('Service was not initialized before used.')
      return 0
    }

    return this.diagnosis.id as number
  }

  async init(): Promise<void> {
    this.diagnosis = await this.diagnosisRepo.create({})
  }

  start() {
    this.store = []
    this.startReadingValueLoop()
  }

  pause() {
    this.loopService.stop()
  }

  resume() {
    this.startReadingValueLoop()
  }

  async stop() {
    if (this.secondaryStore.length > 0) {
      await this.createRecordForPreviousStorage()
    }
    if (this.store.length > 0) {
      await this.recordRepo.create(
        new Record(this.secondaryStore, recordTypes.PIEZO_ELECTRIC_SENSOR_TYPE),
      )
    }
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

  //#region Private Methods
  private async createRecordForPreviousStorage() {
    this.swapStore()
    this.saveRecordPromise = this.recordRepo.create(
      new Record(this.secondaryStore, recordTypes.PIEZO_ELECTRIC_SENSOR_TYPE),
    )
  }

  private startReadingValueLoop() {
    console.log('Start Reading Values from Sensor')
    this.loopService.start()
    ;(async () => {
      while (this.loopService.isStarted) {
        // When store length is 1000, swap the secondary store to use
        if (this.store.length === 1000) {
          this.createRecordForPreviousStorage()
        }

        // When length of main data storage big enough to maintain on its own,
        // we reset secondary storage but we needs to make sure that secondary
        // storage has been saved to be database, therefore, we await the promise
        // here but usually, the promise should have resolved.
        if (
          this.store.length > this.BATCH_DATA_SIZE &&
          this.saveRecordPromise
        ) {
          await this.saveRecordPromise
          this.secondaryStore = []
        }

        const dataWithDateTime = await this.readADS1115Value()
        this.store.push(dataWithDateTime)
      }
    })()
  }

  private swapStore() {
    const temp = this.store
    this.store = this.secondaryStore
    this.secondaryStore = temp
  }

  private async getMockData(): Promise<number> {
    const promise = new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(Math.random())
      }, 5)
    })
    return promise
  }

  //#endregion
}

export default SensorServiceBase
