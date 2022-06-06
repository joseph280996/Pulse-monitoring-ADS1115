import db from '../db'
import * as RecordSqls from '../sqls/recordSqls'
import { RecordedData } from '../types'
import { RecordType } from './Record.type'

class Record {
  public id: number | undefined

  public data!: RecordedData[]

  public typeID!: number

  public diagnosisID?: number

  public handPositionID!: number

  constructor(obj: RecordType) {
    this.id = obj.id
    this.data = obj.data
    this.typeID = obj.typeID
    this.diagnosisID = obj.diagnosisID
    this.handPositionID = obj.handPositionID
  }

  async save(): Promise<Record> {
    const result = await db.query(RecordSqls.CREATE_RECORD_DATA, [
      [this.data, this.diagnosisID, this.handPositionID],
    ])
    return new Record({
      ...this,
      id: result.insertId,
    })
  }

  async updateDiagnosisID(): Promise<Record> {
    const result = await db.query(RecordSqls.UPDATE_DIAGNOSIS_ID, [
      this.diagnosisID,
      this.id,
    ])
    return result && result.changedRows > 1
  }

  static async getByID(id: number) {
    const res = await db.query(RecordSqls.GET_BY_ID, [id])
    return res ? new Record({ ...res, data: JSON.parse(res.data) }) : null
  }

  static async getByDiagnosisID(diagnosisID?: number) {
    if (!diagnosisID) {
      return []
    }
    const res = await db.query(RecordSqls.GET_BY_DIAGNOSIS_ID, [diagnosisID])
    return res && res.length > 0
      ? res.map(
          (row: any) => new Record({ ...row, data: JSON.parse(row.data) }),
        )
      : []
  }
}

export default Record
