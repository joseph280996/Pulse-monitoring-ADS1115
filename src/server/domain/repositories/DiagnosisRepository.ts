import recordTypes from '../../infrastructure/variables/recordTypes'
import EcgSensorService from '../../infrastructure/services/EcgSensorService'
import IRepository from '../interfaces/IRepository'
import DBInstance, { DB } from '../models/DbConnectionModel'
import Diagnosis from '../models/Diagnosis'
import { GetDiagnosisByRangeInputType } from '../models/Diagnosis.types'
import * as DiagnosisSqls from '../sqls/diagnosisSqls'
import RecordSessionRepository from './RecordSessionRepository'

class DiagnosisRepository implements IRepository<Diagnosis, Diagnosis | null> {
  //#region Constructor
  constructor(
    private db: DB = DBInstance,
    private ecgSensorService: EcgSensorService = EcgSensorService.instance,
    private recordRepository: RecordSessionRepository = new RecordSessionRepository(),
  ) {}
  //#endregion

  //#region Public Methods
  async create(diagnosis: Diagnosis) {
    try {
      const result = await this.db.query<
        { insertId: number },
        [Array<number | undefined>]
      >(DiagnosisSqls.CREATE_DIAGNOSIS, [
        [diagnosis.pulseTypeId, diagnosis.patientId],
      ])

      if (!result.insertId) {
        return null
      }

      diagnosis.id = result.insertId

      await this.ecgSensorService.notifyDiagnosisCreated(diagnosis.id as number)

      return diagnosis
    } catch (error) {
      throw new Error(`Error Creating Diagnosis: ${(error as Error).message}`)
    }
  }

  async update(updateDiagnosis: Diagnosis) {
    const result = await this.db.query<
      { affectedRows: number },
      [Diagnosis, number]
    >(DiagnosisSqls.UPDATE_DIAGNOSIS, [
      updateDiagnosis,
      updateDiagnosis.id || 0,
    ])
    return !!result && result.affectedRows > 0
  }

  async getAll(): Promise<Diagnosis[]> {
    const res: Diagnosis[] = await this.db.query<Diagnosis[], []>(
      DiagnosisSqls.GET_ALL,
      [],
    )

    if (!res || res.length == 0) {
      return []
    }

    return res
  }

  public async getByIdWithNoRecord(id: number) {
    return this.getById(id, false)
  }

  public async getById(id: number, shouldPopulateRecords = true) {
    const res = await this.db.query<Diagnosis[], [number]>(
      DiagnosisSqls.GET_BY_ID,
      [id],
    )

    if (!res || res.length == 0) {
      return null
    }

    const diagnosis = res[0]

    if (shouldPopulateRecords) {
      diagnosis.piezoElectricRecords = (
        await this.recordRepository.getWithRecordByDiagnosisIdAndType(
          recordTypes.PIEZO_ELECTRIC_SENSOR_TYPE,
          id,
        )
      )[0]
      diagnosis.ecgRecords = (
        await this.recordRepository.getWithRecordByDiagnosisIdAndType(
          recordTypes.ECG_SENSOR_TYPE,
          id,
        )
      )[0]
    }

    return diagnosis
  }

  async getByDateRange({
    startDate,
    endDate,
  }: GetDiagnosisByRangeInputType): Promise<Diagnosis[]> {
    const res = await this.db.query<Diagnosis[], string[]>(
      DiagnosisSqls.GET_BY_DATE_RANGE,
      [startDate, endDate],
    )

    if (!res || res.length == 0) {
      return []
    }

    return res
  }
  //#endregion
}
export default DiagnosisRepository
