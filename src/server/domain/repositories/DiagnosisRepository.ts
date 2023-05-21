import IRepository from '../interfaces/IRepository'
import DBInstance, { DB } from '../models/DbConnectionModel'
import Diagnosis from '../models/Diagnosis'
import {
  GetDiagnosisByRangeInputType,
} from '../models/Diagnosis.types'
import * as DiagnosisSqls from '../sqls/diagnosisSqls'
import RecordRepository from './RecordRepository'

class DiagnosisRepository implements IRepository<Diagnosis, Diagnosis | null> {
  //#region properties
  db!: DB

  private static _instance: DiagnosisRepository
  //#endregion

  //#region getters
  static get instance(): DiagnosisRepository {
    if (!this._instance) {
      this._instance = new DiagnosisRepository()
    }
    return this._instance
  }
  //#endregion

  //#region constructor
  constructor(db = DBInstance) {
    this.db = db
  }
  //#endregion

  //#region public methods
  async create(diagnosis: Diagnosis) {
    try {
      const result = await this.db.query<
        [{ insertId: number }, Diagnosis],
        [Array<number | undefined>]
      >(DiagnosisSqls.CREATE_DIAGNOSIS, [
        [diagnosis.pulseTypeId, diagnosis.patientId],
      ])

      const insertedDiagnosis = result[1]
      return new Diagnosis(
        insertedDiagnosis.patientId,
        insertedDiagnosis.handPositionId,
        insertedDiagnosis.pulseTypeId,
        insertedDiagnosis.id,
        insertedDiagnosis.dateTimeCreated,
        insertedDiagnosis.dateTimeUpdated,
      )
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
    const res: any[] = await this.db.query<Diagnosis[], []>(
      DiagnosisSqls.GET_ALL,
      [],
    )

    if (!res || res.length == 0) {
      return []
    }

    return res
  }

  public async getById(id: number) {
    return this.getByIdWithRecord(id, false)
  }

  public async getByIdWithRecord(id: number, shouldPopulateRecords = true) {
    const res = await this.db.query<Diagnosis[], [number]>(
      DiagnosisSqls.GET_BY_ID,
      [id],
    )

    if (!res) {
      return null
    }

    const diagnosis = res[0]

    if (shouldPopulateRecords) {
      const piezoRecords = await RecordRepository.instance.getByDiagnosisId(id, 1)
      const ecgRecords = await RecordRepository.instance.getByDiagnosisId(id, 2)

      diagnosis.piezoElectricRecords = piezoRecords
      diagnosis.ecgRecords = ecgRecords
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
