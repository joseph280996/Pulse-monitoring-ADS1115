import { DiagnosisDto } from '../dtos/DiagnosisDto'
import IRepository from '../interfaces/IRepository'
import DBInstance, { DB } from '../models/DbConnectionModel'
import Diagnosis from '../models/Diagnosis'
import { GetDiagnosisByRangeInputType } from '../models/Diagnosis.types'
import * as DiagnosisSqls from '../sqls/diagnosisSqls'

class DiagnosisRepository
  implements IRepository<DiagnosisDto, Diagnosis | null> {
  db!: DB

  constructor(db = DBInstance) {
    this.db = db
  }

  async create(diagnosis: DiagnosisDto) {
    try {
      const result = await this.db.query<
        { insertId: number },
        [Array<number | undefined>]
      >(DiagnosisSqls.CREATE_DIAGNOSIS, [
        [
          diagnosis.pulseTypeID,
          diagnosis.patientID,
          diagnosis.piezoelectricRecordID,
        ],
      ])
      return new Diagnosis({
        ...diagnosis,
        id: result.insertId,
      })
    } catch (error) {
      return null
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
}
export default new DiagnosisRepository()
