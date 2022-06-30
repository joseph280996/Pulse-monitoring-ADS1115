import DBInstance, { DB } from '../db'
import RecordSessionDto from '../dtos/RecordSessionDto'
import recordSessionWithRecordMapper from '../mapper/recordSessionWithRecordMapper'
import RecordSession from '../models/RecordSession'
import { RecordSessionDataType } from '../models/RecordSession.types'
import * as RecordSessionSqls from '../sqls/recordSessionSqls'

class RecordSessionRepository {
  private db: DB

  constructor(db = DBInstance) {
    this.db = db
  }

  async getByID(id: number) {
    const result = await this.db.query<RecordSessionDataType, [number]>(
      RecordSessionSqls.GET_BY_ID,
      [id],
    )
    return result ? new RecordSession(result) : null
  }

  async getByIDWithRecords(id: number) {
    console.log(id)
    const result = await this.db.query<any, [number]>(
      RecordSessionSqls.GET_BY_ID_WITH_RECORD,
      [id],
    )
    console.log(result)
    return result ? recordSessionWithRecordMapper(result[0]) : null
  }

  async create(recordSession: RecordSessionDto) {
    RecordSessionRepository.guardAgainstInvalidCreateRecordSession(
      recordSession,
    )
    console.log(recordSession)
    console.log(recordSession.handPositionID)
    const result = await this.db.query<
      { insertId: number },
      [[number, number | undefined, number]]
    >(RecordSessionSqls.CREATE_RECORD_SESSION, [
      [
        recordSession.piezoelectricRecordID,
        recordSession.ecgRecordID,
        recordSession.handPositionID,
      ],
    ])
    return new RecordSession({
      ...recordSession,
      id: result.insertId,
    })
  }

  async update(updatedRecord: RecordSessionDto) {
    RecordSessionRepository.guardAgainstInvalidUpdateRecordSession(
      updatedRecord,
    )
    const result = await this.db.query<
      { affectedRows: number },
      [RecordSessionDto, number]
    >(RecordSessionSqls.UPDATE_RECORD_SESSION, [
      updatedRecord,
      updatedRecord.id as number,
    ])
    return !!result && result.affectedRows > 0
  }

  private static guardAgainstInvalidCreateRecordSession(
    record: RecordSessionDto,
  ) {
    if (!record.piezoelectricRecordID) {
      throw new Error(
        'Missing required fields [piezoelectricRecordID] in RecordSessionDto for creation',
      )
    }
    if (!record.handPositionID) {
      throw new Error(
        'Missing required fields [handPositionID] in RecordSessionDto for creation',
      )
    }
  }

  private static guardAgainstInvalidUpdateRecordSession(
    updatedRecord: RecordSessionDto,
  ) {
    if (!updatedRecord.id) {
      throw new Error(
        'Missing required fields [id] in RecordSessionDto for update',
      )
    }
  }
}

export default new RecordSessionRepository()
