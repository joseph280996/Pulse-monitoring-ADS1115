import IRepository from '../interfaces/IRepository'
import { mapRecordDataToModel } from '../mappers/recordDataMapper'
import DBInstance, { DB } from '../../infrastructure/services/DbService'
import Record from '../models/Record'
import { RecordDataType } from '../models/Record.types'
import * as RecordSqls from '../sqls/recordSqls'
import recordTypes from '../../infrastructure/variables/recordTypes'

class RecordRepository implements IRepository<Record, Record | null> {
  constructor(private db: DB = DBInstance) {}

  update(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getById(): Promise<Record | null> {
    throw new Error('Method not implemented.')
  }

  async create(record: Record): Promise<Record> {
    try {
      const serializedRecords = JSON.stringify(record.data)
      const result = await this.db.query<
        { insertId: number },
        [[string, number]]
      >(RecordSqls.CREATE_RECORD_DATA, [
        [serializedRecords, recordTypes.PIEZO_ELECTRIC_SENSOR_TYPE],
      ])

      record.id = result.insertId

      return record
    } catch (error) {
      throw new Error(`Error saving record: ${(error as Error).message}`)
    }
  }

  async getByDiagnosisId(diagnosisId: number): Promise<Record[]> {
    try {
      const res = await this.db.query<RecordDataType[], [number]>(
        RecordSqls.GET_BY_DIAGNOSIS_ID,
        [diagnosisId],
      )
      if (!res || res.length == 0) {
        return []
      }

      return res.map(mapRecordDataToModel)
    } catch (error) {
      throw new Error(`Error getting record with diagnosisId [${diagnosisId}]`)
    }
  }
}

export default RecordRepository
