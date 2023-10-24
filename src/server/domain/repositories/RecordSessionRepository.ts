import DBInstance, { DB } from '../../infrastructure/services/DbService'
import RecordSession from '../models/RecordSession'
import { RecordSessionDataType } from '../models/RecordSession.types'
import * as RecordSessionSqls from '../sqls/recordSessionSqls'
import IRepository from '../interfaces/IRepository'
import { mapRecordDataToModel } from '../mappers/recordDataMapper'
import { mapRecordSessionDataToModel } from '../mappers/recordSessionDataMapper'

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

  /**
   * Get RecordSession by id
   *
   * Retrieve the RecordSession with the provided id
   *
   * @returns the record session that was requested
   */
  async getById(id: number): Promise<RecordSession> {
    const res = await this.db.query<[RecordSessionDataType], [number]>(
      RecordSessionSqls.GET_BY_ID,
      [id],
    )
    if (!res) {
      throw new Error(`Cannot find Record with Id [${id}]`)
    }

    return mapRecordSessionDataToModel(res[0])
  }

  /**
   * Get RecordSession by diagnosisId and typeId
   *
   * Retrieve the RecordSession associated with the diagnosisId and sensorTypeId
   *
   * @returns the record session that matched the filter
   */
  async getWithRecordByDiagnosisIdAndType(
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

    const mappedSessions = res.reduce(
      (sessions: Map<number, RecordSession>, row: any) => {
        if (!sessions.has(row.sessionId)) {
          sessions.set(row.sessionId, mapRecordSessionDataToModel(row))
        }

        const session = sessions.get(row.sessionId)
        if (session) {
          const record = mapRecordDataToModel({
            id: row.recordId,
            recordSessionId: row.recordSessionId,
            dateTimeCreated: row.recordDateTimeCreated,
            dateTimeUpdated: row.recordDateTimeUpdated,
            data: row.data,
          })

          if (!session.records) {
            session.records = []
          }

          session.records = session.records?.concat(record.data)
        }

        return sessions
      },
      new Map(),
    )

    return Array.from(mappedSessions, ([_, value]) => value)
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
