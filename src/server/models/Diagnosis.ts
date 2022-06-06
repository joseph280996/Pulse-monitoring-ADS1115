import db from '../db'
import * as DiagnosisSqls from '../sqls/diagnosisSqls'
import { IDiagnosis } from '../types/interface/IDiagnosis'
import {
  GetDiagnosisByRangeInputType,
  DiagnosisFieldsType,
} from './Diagnosis.types'
import Record from './Record'

class Diagnosis implements IDiagnosis {
  public id: number | undefined

  public pulseTypeID: number | undefined

  public patientID: number | undefined

  public records?: [Record]

  constructor(obj: DiagnosisFieldsType) {
    this.id = obj.id
    this.pulseTypeID = obj.pulseTypeID
    this.patientID = obj.patientID
  }

  public getRecords(): Promise<[Record]> {
    return Record.getByDiagnosisID(this.id)
  }

  async save(): Promise<Diagnosis> {
    const result = await db.query(DiagnosisSqls.CREATE_RECORD, [
      [this.pulseTypeID, this.patientID],
    ])
    return new Diagnosis({
      ...this,
      id: result.insertId,
    })
  }

  static async getByID(id: number) {
    const res = await db.query(DiagnosisSqls.GET_BY_ID, [id])
    return res ? new Diagnosis(res) : null
  }

  static async getByDateRange({
    startDate,
    endDate,
  }: GetDiagnosisByRangeInputType): Promise<[Diagnosis]> {
    const res = await db.query(DiagnosisSqls.GET_BY_DATE_RANGE, [
      startDate,
      endDate,
    ])
    return res && res.length > 0
      ? res.map((row: any) => new Diagnosis(row))
      : []
  }
}

export default Diagnosis
