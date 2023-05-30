import DBInstance, { DB } from '../models/DbConnectionModel'
import RecordSession from '../models/RecordSession'
import { RecordSessionDataType } from '../models/Record.types'
import * as RecordSqls from '../sqls/recordSessionSqls'
import IRepository from '../interfaces/IRepository'
import RecordRepository from './RecordRepository'

class RecordSessionRepository
  implements IRepository<RecordSession, RecordSession | null>
{
  //#region constructor
  constructor(
    private db: DB = DBInstance,
    private recordRepository: RecordRepository = new RecordRepository(),
  ) {
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
    return new RecordSession(
      res[0].diagnosisId,
      res[0].recordTypeId,
      res[0].id,
      res[0].dateTimeCreated,
      res[0].dateTimeUpdated,
    )
  }

  async getByDiagnosisIdAndType(
    recordTypeId: number,
    diagnosisId?: number,
  ): Promise<RecordSession[]> {
    if (!diagnosisId) {
      return []
    }
    const res = await this.db.query<RecordSessionDataType[], [number, number]>(
      RecordSqls.GET_BY_DIAGNOSIS_ID_AND_TYPE,
      [diagnosisId, recordTypeId],
    )

    if (!res || res.length == 0) {
      return []
    }

    return Promise.all(
      res.map(async (row) => {
        const recordSession = new RecordSession(
          row.diagnosisId,
          row.recordTypeId,
          row.id,
          row.dateTimeCreated,
          row.dateTimeUpdated,
        )
        recordSession.records = await this.recordRepository.getBySessionId(
          row.id as number,
        )

        return recordSession
      }),
    )
  }

  async create(recordSession: RecordSession): Promise<RecordSession> {
    try {
      const result = await this.db.query<
        { insertId: number },
        [[number, number]]
      >(RecordSqls.CREATE_RECORD_DATA, [[recordSession.diagnosisId, 1]])

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
