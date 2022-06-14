import DBInstance, { DB } from '../db'
import RecordDto from '../dtos/RecordDto'
import Record from '../models/Record'
import { RecordDataType } from '../models/Record.types'
import * as RecordSqls from '../sqls/recordSqls'

class RecordRepository {
  private db: DB

  constructor(db = DBInstance) {
    this.db = db
  }

  async getByID(id: number) {
    const res = await this.db.query<RecordDataType, number>(
      RecordSqls.GET_BY_ID,
      [id],
    )
    return res ? new Record({ ...res, data: JSON.parse(res.data) }) : null
  }

  async getByDiagnosisID(diagnosisID?: number) {
    if (!diagnosisID) {
      return []
    }
    const res = await this.db.query<RecordDataType[], number>(
      RecordSqls.GET_BY_DIAGNOSIS_ID,
      [diagnosisID],
    )
    return res && res.length > 0
      ? res.map(
          (row: RecordDataType) =>
            new Record({ ...row, data: JSON.parse(row.data) }),
        )
      : []
  }

  async getByDiagnosisIDAndType(typeID: number, diagnosisID: number) {
    if (!diagnosisID) {
      return []
    }
    const res = await this.db.query<RecordDataType[], number>(
      RecordSqls.GET_BY_DIAGNOSIS_ID_AND_TYPE,
      [diagnosisID, typeID],
    )
    return res && res.length > 0
      ? res.map(
          (row: RecordDataType) =>
            new Record({ ...row, data: JSON.parse(row.data) }),
        )
      : []
  }

  async create(record: RecordDto): Promise<Record> {
    const serializedData = JSON.stringify(record.data)

    const result = await this.db.query<{ insertId: number }, [number, string]>(
      RecordSqls.CREATE_RECORD_DATA,
      [[record.typeID, serializedData]],
    )
    return new Record({
      ...record,
      data: serializedData,
      id: result.insertId,
    })
  }

  async update(updatedRecord: Record): Promise<boolean> {
    RecordRepository.guardAgaisntInvalidRecord(updatedRecord)
    await this.auditRecord(updatedRecord as Record)

    const result = await this.db.query<
      { changedRows: number },
      number | undefined
    >(RecordSqls.UPDATE_DIAGNOSIS_ID, [updatedRecord.id])
    return result && result.changedRows > 1
  }

  auditRecord(record: Record): Promise<void> {
    return this.db.query(RecordSqls.AUDIT_RECORD, [
      record.id,
      record.data,
      record.typeID,
      record.dateTimeCreated,
      record.dateTimeUpdated,
    ])
  }

  private static guardAgaisntInvalidRecord(record: Record | null) {
    if (!record) {
      throw new Error(`Parameter is null (${Record.name})`)
    }
    if (!record.id) {
      throw new Error(`Required field is missing for ${Record.name}`)
    }
  }
}

export default RecordRepository
