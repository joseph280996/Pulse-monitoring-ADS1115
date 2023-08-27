import DBInstance, { DB } from '../../infrastructure/services/DbService'
import RecordSession from '../models/RecordSession'
import { RecordSessionDataType } from '../models/RecordSession.types'
import * as RecordSessionSqls from '../sqls/recordSessionSqls'
import IRepository from '../interfaces/IRepository'
import { mapRecordSession, mapRecordSessionWithRecord } from '../mappers/recordSessionMapper'

class RecordSessionRepository
  implements IRepository<RecordSession, RecordSession | null>
{
  //#region Constructor
  constructor(private db: DB = DBInstance) {
    this.db = db
  }

  //#endregion

  //#region Public Methods
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
      RecordSessionSqls.GET_BY_ID,
      [id],
    )
    if (!res) {
      throw new Error(`Cannot find Record with Id [${id}]`)
    }
    return mapRecordSession(res[0])
  }

  async getByDiagnosisId(
    recordTypeId: number,
    diagnosisId?: number,
  ): Promise<RecordSession[]> {
    if (!diagnosisId) {
      return []
    }

    const res = await this.db.query<RecordSessionDataType[], [number, number]>(
      RecordSessionSqls.GET_WITH_RECORDS_BY_DIANGOSIS_ID_AND_TYPE,
      [diagnosisId, recordTypeId],
    )

    if (!res || res.length == 0) {
      return []
    }

    return mapRecordSessionWithRecord(res)
  }

  async create(recordSession: RecordSession): Promise<RecordSession> {
    try {
      const result = await this.db.query<
        { insertId: number },
        [[number, number]]
      >(RecordSessionSqls.CREATE_RECORD_DATA, [[recordSession.diagnosisId, 1]])

      recordSession.id = result.insertId

      return recordSession
    } catch (error) {
      throw new Error(`Error saving record: ${(error as Error).message}`)
    }
  }

  update(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  //#endregion
}

export default RecordSessionRepository
