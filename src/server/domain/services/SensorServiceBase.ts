import LoopService from '../../infrastructure/services/LoopService'
import getLastNElementsFromRecordedData from '../../infrastructure/utils/functions/getLastNElementsFromRecordedData'
import DiagnosisRepository from '../repositories/DiagnosisRepository'
import Diagnosis from '../models/Diagnosis'
import RecordRepository from '../repositories/RecordRepository'
import RecordSession from '../models/RecordSession'
import ISensorService from '../interfaces/ISensorService'
import Record from '../models/Record'

abstract class SensorServiceBase implements ISensorService {
    //#region Abstract Methods
    public abstract get name(): string;
    protected abstract readADS1115Value(): Promise<Record>;
    //#endregion

    //#region constructor
    constructor(
        protected diagnosisRepo: DiagnosisRepository = DiagnosisRepository.instance,
        private recordRepo: RecordRepository = RecordRepository.instance,
        private saveRecordPromise: Promise<RecordSession> | null = null,
        protected diagnosis: Diagnosis | null = null,
        private store: Record[] = [],
        private secondaryStore: Record[] = [],
        private readonly BATCH_DATA_SIZE = 20,
        private readonly loopService: LoopService = new LoopService()
    ) {
    }
    //#endregion

    //#region pulic methods
    async init() {
        this.diagnosis = await this.diagnosisRepo.create({})
    }

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
            diagnosisId: this.diagnosis?.id as number,
        })
    }

    private swapStore() {
        const temp = this.store
        this.store = this.secondaryStore
        this.secondaryStore = temp
    }
    //#endregion
}

export default SensorServiceBase;
