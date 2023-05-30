import IDb from '../interfaces/IDb'
import IRepository from '../interfaces/IRepository'
import { mapRecordDataToModel } from '../mappers/recordDataMapper'
import DbConnectionModel from '../models/DbConnectionModel'
import Record from '../models/Record'
import { RecordDataType } from '../models/Record.types'
import * as RecordSqls from '../sqls/recordSqls'

class RecordRepository implements IRepository<Record, Record | null> {
  constructor(private db: IDb = DbConnectionModel) {}

  update(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getById(): Promise<Record | null> {
    throw new Error('Method not implemented.')
  }

  async getBySessionId(id: number): Promise<Record[]> {
    const res = await this.db.query<RecordDataType[], [number]>(
      RecordSqls.GET_BY_SESSION_ID,
      [id],
    )
    if (!res || res.length == 0) {
      return []
    }

    return res.map(mapRecordDataToModel)
  }

  async create(record: Record): Promise<Record> {
    try {
      const serializedRecords = JSON.stringify(record.data)
      const result = await this.db.query<
        { insertId: number },
        [[string, number]]
      >(RecordSqls.CREATE_RECORD_DATA, [
        [serializedRecords, record.recordSessionId as number],
      ])

      record.id = result.insertId

      return record
    } catch (error) {
      throw new Error(`Error saving record: ${(error as Error).message}`)
    }
  }
}

export default RecordRepository
