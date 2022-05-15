import IRecord from 'src/server/types/interface/IRecord'
import db from '../db'
import * as RecordSqls from '../sqls/recordSqls'
import { RecordedData } from '../types'
import { GetRecordByRangeInputType, RecordFieldsType } from './Record.types'

class Record implements IRecord {
  public id: number | undefined

  public pulseTypeID: number | undefined

  public handPositionID!: number

  public data!: RecordedData[]

  public patientID: number | undefined

  constructor(obj: RecordFieldsType) {
    this.id = obj.id
    this.pulseTypeID = obj.pulseTypeID
    this.handPositionID = obj.handPositionID
    this.data = obj.data
    this.patientID = obj.patientID
  }

  async save(): Promise<Record> {
    const result = await db.query(RecordSqls.CREATE_RECORD, [
      [this.data, this.pulseTypeID, this.handPositionID, this.patientID],
    ])
    return new Record({
      ...this,
      data: JSON.stringify(this.data),
      id: result.insertId,
    })
  }

  static async getByID(id: number) {
    const res = await db.query(RecordSqls.GET_BY_ID, [id])
    return res ? new Record(res) : null
  }

  static async getByDateRange({
    startDate,
    endDate,
  }: GetRecordByRangeInputType): Promise<[Record]> {
    const res = await db.query(RecordSqls.GET_BY_DATE_RANGE, [
      startDate,
      endDate,
    ])
    return res && res.length > 0
      ? res.map((row: any) => {
          const parsedRowData: RecordedData[] = JSON.parse(row.data)
          return new Record({ ...row, data: parsedRowData })
        })
      : []
  }
}

export default Record
