/// <reference path="../../../types/ads1115/index.d.ts"/>

/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
import i2c, { PromisifiedBus } from 'i2c-bus'
import ADS1115 from 'ads1115'
import moment from 'moment'
import { RecordedData } from 'src/server/application/handlers/webSocket/sensorValueHandler.types'
import LoopService from '../../infrastructure/services/LoopService'
import getLastNElementsFromRecordedData from '../../infrastructure/utils/functions/getLastNElementsFromRecordedData'
import DiagnosisRepository from '../repositories/DiagnosisRepository'
import Diagnosis from '../models/Diagnosis'
import RecordRepository from '../repositories/RecordRepository'
import Record from '../models/Record'
import ISensorService from '../interfaces/ISensorService'

class PiezoElectricSensorService implements ISensorService {
  //#region properties
  private static _instance: PiezoElectricSensorService

  private readonly SERVICE_NAME = 'piezoElectricService'
  private readonly BATCH_DATA_SIZE = 20

  private readonly loopService: LoopService = new LoopService()

  private store: RecordedData[] = []
  private secondaryStore: RecordedData[] = []

  private saveRecordPromise: Promise<Record> | null = null
  private bus: PromisifiedBus | null = null
  private ads1115: typeof ADS1115 = ADS1115
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
      this._instance = new PiezoElectricSensorService()
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

  //#region pulic methods
  async init() {
    this.diagnosis = await this.diagnosisRepo.create({})
    this.bus = await i2c.openPromisified(1)
    this.ads1115 = await ADS1115(this.bus)
  }

  // Start Reading Values from Sensor
  start() {
    this.store = []
    console.log('Start Reading Values from Sensor')
    this.loopService.start()
      ; (async () => {
        while (this.loopService.isStarted) {
          // When store length is 1000, swap the secondary store to use
          if (this.store.length === 1000) {
            this.createRecordForPreviousStorage()
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

          const dataWithDateTime = await this.readADS1115Value()
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
  private async createRecordForPreviousStorage() {
    this.swapStore()
    this.saveRecordPromise = this.recordRepo.create({
      data: this.secondaryStore,
      diagnosisID: this.diagnosis?.id as number,
    })
  }

  private async readADS1115Value(): Promise<RecordedData> {
    const data: number = await this.ads1115.measure('0+GND')
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

export default PiezoElectricSensorService
