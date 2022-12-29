import { DiagnosisDto } from 'src/server/application/dtos/DiagnosisDto'
import IRepository from '../interfaces/IRepository'
import DBInstance, { DB } from '../models/DbConnectionModel'
import Diagnosis from '../models/Diagnosis'
import { GetDiagnosisByRangeInputType } from '../models/Diagnosis.types'
import * as DiagnosisSqls from '../sqls/diagnosisSqls'

class DiagnosisRepository
  implements IRepository<DiagnosisDto, Diagnosis | null>
{
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
  async create(diagnosis: DiagnosisDto) {
    try {
      console.log(diagnosis)
      const result = await this.db.query<
        { insertId: number },
        [Array<number | undefined>]
      >(DiagnosisSqls.CREATE_DIAGNOSIS, [
        [diagnosis.pulseTypeID, diagnosis.patientID],
      ])
      return new Diagnosis({
        ...diagnosis,
        id: result.insertId,
      })
    } catch (error) {
      throw new Error(`Error Creating Diagnosis: ${(error as Error).message}`)
    }
  }

  async update(updateDiagnosis: DiagnosisDto) {
    const result = await this.db.query<
      { affectedRows: number },
      [DiagnosisDto, number]
    >(DiagnosisSqls.UPDATE_DIAGNOSIS, [
      updateDiagnosis,
      updateDiagnosis.id || 0,
    ])
    return !!result && result.affectedRows > 0
  }

  async getByID(id: number) {
    const res: DiagnosisDto = await this.db.query<DiagnosisDto, [number]>(
      DiagnosisSqls.GET_BY_ID,
      [id],
    )
    return res ? new Diagnosis(res) : null
  }

  async getByDateRange({
    startDate,
    endDate,
  }: GetDiagnosisByRangeInputType): Promise<Diagnosis[]> {
    const res = await this.db.query<DiagnosisDto[], string[]>(
      DiagnosisSqls.GET_BY_DATE_RANGE,
      [startDate, endDate],
    )
    return res && res.length > 0
      ? res.map((row: DiagnosisDto) => new Diagnosis(row))
      : []
  }
  //#endregion
}
export default DiagnosisRepository
