import IRepository from '../interface/IRepository'
import DBInstance, { DB } from '../models/DbConnectionModel'
import Diagnosis from '../models/Diagnosis'
import {
  DiagnosisDataType,
  GetDiagnosisByRangeInputType,
} from '../models/Diagnosis.types'
import * as DiagnosisSqls from '../sqls/diagnosisSqls'

class DiagnosisRepository
  implements IRepository<DiagnosisDataType, Diagnosis | null> {
  db!: DB

  constructor(db = DBInstance) {
    this.db = db
  }

  async create(diagnosis: DiagnosisDataType) {
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

  async update(updateDiagnosis: DiagnosisDataType) {
    const result = await this.db.query<
      { affectedRows: number },
      [DiagnosisDataType, number]
    >(DiagnosisSqls.UPDATE_DIAGNOSIS, [
      updateDiagnosis,
      updateDiagnosis.id || 0,
    ])
    return !!result && result.affectedRows > 0
  }

  async getByID(id: number) {
    const res: DiagnosisDataType = await this.db.query<
      DiagnosisDataType,
      [number]
    >(DiagnosisSqls.GET_BY_ID, [id])
    return res ? new Diagnosis(res) : null
  }

  async getByDateRange({
    startDate,
    endDate,
  }: GetDiagnosisByRangeInputType): Promise<Diagnosis[]> {
    const res = await this.db.query<DiagnosisDataType[], string[]>(
      DiagnosisSqls.GET_BY_DATE_RANGE,
      [startDate, endDate],
    )
    return res && res.length > 0
      ? res.map((row: DiagnosisDataType) => new Diagnosis(row))
      : []
  }
}
export default new DiagnosisRepository()
