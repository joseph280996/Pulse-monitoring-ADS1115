import DBInstance, { DB } from '../models/DbConnectionModel'
import RecordSession from '../models/RecordSession'
import { RecordSessionDataType } from '../models/Record.types'
import * as RecordSqls from '../sqls/recordSqls'
import IRepository from '../interfaces/IRepository'
import { mapRecordDataToModel } from '../mappers/recordSessionDataMappers'

class RecordRepository implements IRepository<RecordSession, RecordSession | null> {
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
    const res = await this.db.query<[RecordSessionDataType], [number]>(
      RecordSqls.GET_BY_ID,
      [id],
    )
    if (!res) {
      throw new Error(`Cannot find Record with Id [${id}]`)
    }
    return mapRecordDataToModel(res[0])
  }

  async getByDiagnosisIdAndType(recordTypeId: number, diagnosisId?: number): Promise<any> {
    if (!diagnosisId) {
      return []
    }
    const res = await this.db.query<RecordSessionDataType[], [number, number]>(
      RecordSqls.GET_BY_DIAGNOSIS_ID_AND_TYPE,
      [diagnosisId, recordTypeId],
    )

    if (res && res.length > 0) {
      return res.map(mapRecordDataToModel)
    }
    return []
  }

  async create(record: RecordSession): Promise<RecordSession> {
    try {
      const serializedData = JSON.stringify(record.records)
      const result = await this.db.query<
        { insertId: number },
        [[string, number, number]]
      >(RecordSqls.CREATE_RECORD_DATA, [[serializedData, record.diagnosisId, 1]])

      record.id = result.insertId

      return record
    } catch (error) {
      throw new Error(`Error saving record: ${(error as Error).message}`)
    }
  }

  async update(updatedRecord: RecordSession): Promise<boolean> {
    RecordRepository.guardAgainstInvalidRecord(updatedRecord)

    const result = await this.db.query<
      { changedRows: number },
      [number | undefined]
    >(RecordSqls.UPDATE_DIAGNOSIS_ID, [updatedRecord.id])
    return result && result.changedRows > 1
  }

  async getLatest(): Promise<RecordSession | null> {
    const result = await this.db.query<RecordSessionDataType[], undefined>(
      RecordSqls.GET_LATEST,
    )
    return result?.length > 0
      ? mapRecordDataToModel(result[0])
      : null
  }
  //#endregion

  //#region private methods
  private static guardAgainstInvalidRecord(record: RecordSession | null) {
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
