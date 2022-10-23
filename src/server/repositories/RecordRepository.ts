import DBInstance, { DB } from '../models/DbConnectionModel'
import RecordDto from '../dtos/RecordDto'
import Record from '../models/Record'
import { RecordDataType } from '../models/Record.types'
import * as RecordSqls from '../sqls/recordSqls'
import IRepository from '../interface/IRepository'

class RecordRepository implements IRepository<RecordDto, Record | null> {
  // Private Properties
  private db: DB
  // End of Private Properties

  // Constructor
  constructor(db = DBInstance) {
    this.db = db
  }
  // End of Constructor

  // Public Functions

  async exist(id: number) {
    try {
      await this.getByID(id)
      return true
    } catch (err) {
      return false
    }
  }

  async getByID(id: number) {
    const res = await this.db.query<[RecordDataType], [number]>(
      RecordSqls.GET_BY_ID,
      [id],
    )
    if (!res) {
      throw new Error(`Cannot find Record with ID [${id}]`)
    }
    return new Record({ ...res[0], data: JSON.parse(res[0].data) })
  }

  async getByDiagnosisID(diagnosisID?: number) {
    if (!diagnosisID) {
      return []
    }
    const res = await this.db.query<RecordDataType[], [number]>(
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

  async getByDiagnosisIDAndType(diagnosisID: number) {
    if (!diagnosisID) {
      return []
    }
    const res = await this.db.query<RecordDataType[], number[]>(
      RecordSqls.GET_BY_DIAGNOSIS_ID_AND_TYPE,
      [diagnosisID],
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
    const result = await this.db.query<
      { insertId: number },
      [[string, number]]
    >(RecordSqls.CREATE_RECORD_DATA, [[serializedData, record.handPositionID]])

    return new Record({
      ...record,
      data: serializedData,
      id: result.insertId,
    })
  }

  async update(updatedRecord: RecordDto): Promise<boolean> {
    RecordRepository.guardAgaisntInvalidRecord(updatedRecord)
    await this.auditRecord(updatedRecord)

    const result = await this.db.query<
      { changedRows: number },
      [number | undefined]
    >(RecordSqls.UPDATE_DIAGNOSIS_ID, [updatedRecord.id])
    return result && result.changedRows > 1
  }

  auditRecord(record: RecordDto): Promise<void> {
    return this.db.query(RecordSqls.AUDIT_RECORD, [
      record.id,
      record.data,
      record.dateTimeCreated,
      record.dateTimeUpdated,
    ])
  }

  // End of Public Functions

  // Private Functions
  private static guardAgaisntInvalidRecord(record: RecordDto | null) {
    if (!record) {
      throw new Error(`Parameter is null (${Record.name})`)
    }
    if (!record.id) {
      throw new Error(`Required field is missing for ${Record.name}`)
    }
  }
  // End of Private Functions
}

export default new RecordRepository()
