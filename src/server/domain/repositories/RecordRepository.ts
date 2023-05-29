import DBInstance, { DB } from '../models/DbConnectionModel'
import RecordDto from 'src/server/application/dtos/RecordDto'
import RecordSession from '../models/RecordSession'
import { RecordDataType } from '../models/Record.types'
import * as RecordSqls from '../sqls/recordSqls'
import IRepository from '../interfaces/IRepository'

class RecordRepository implements IRepository<RecordDto, RecordSession | null> {
  //#region constructor
  constructor(private db: DB = DBInstance) {
    this.db = db
  }
  //#endregion

  //#region public methods
  async exist(id: number) {
    try {
      await this.getById(id)
      return true
    } catch (err) {
      return false
    }
  }

  async getById(id: number) {
    const res = await this.db.query<[RecordDataType], [number]>(
      RecordSqls.GET_BY_ID,
      [id],
    )
    if (!res) {
      throw new Error(`Cannot find Record with Id [${id}]`)
    }
    return new RecordSession({ ...res[0], data: JSON.parse(res[0].data) })
  }

  async getByDiagnosisId(recordTypeId: number, diagnosisId?: number): Promise<any> {
    if (!diagnosisId) {
      return []
    }
    const res = await this.db.query<RecordDataType[], [number, number]>(
      RecordSqls.GET_PIEZO_RECORDS_BY_DIAGNOSIS_ID,
      [diagnosisId, recordTypeId],
    )

    if (res && res.length > 0) {
      return res.reduce(
        (recordedData: any, row: RecordDataType) => {
          const data = JSON.parse(row.data)
          return [...recordedData, ...data]
        }, []
      )
    }
    return []
  }

  async getByDiagnosisIdAndType(diagnosisId: number) {
    if (!diagnosisId) {
      return []
    }
    const res = await this.db.query<RecordDataType[], number[]>(
      RecordSqls.GET_BY_DIAGNOSIS_ID_AND_TYPE,
      [diagnosisId],
    )
    return res && res.length > 0
      ? res.map(
        (row: RecordDataType) =>
          new RecordSession({ ...row, data: JSON.parse(row.data) }),
      )
      : []
  }

  async create(record: RecordDto): Promise<RecordSession> {
    try {
      const serializedData = JSON.stringify(record.data)
      const result = await this.db.query<
        { insertId: number },
        [[string, number, number]]
      >(RecordSqls.CREATE_RECORD_DATA, [[serializedData, record.diagnosisId, 1]])

      return new RecordSession({
        ...record,
        data: serializedData,
        id: result.insertId,
        recordTypeId: 1
      })
    } catch (error) {
      throw new Error(`Error saving record: ${(error as Error).message}`)
    }
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

  async getLatest(): Promise<RecordSession | null> {
    const result = await this.db.query<RecordDataType[], undefined>(
      RecordSqls.GET_LATEST,
    )
    return result?.length > 0
      ? new RecordSession({ ...result[0], data: JSON.parse(result[0].data) })
      : null
  }
  //#endregion

  //#region private methods
  private static guardAgaisntInvalidRecord(record: RecordDto | null) {
    if (!record) {
      throw new Error(`Parameter is null (${RecordSession.name})`)
    }
    if (!record.id) {
      throw new Error(`Required field is missing for ${RecordSession.name}`)
    }
  }
  //#endregion
}

export default RecordRepository
