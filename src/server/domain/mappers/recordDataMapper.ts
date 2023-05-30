import RecordInstance from '../models/RecordInstance'
import { RecordDataType, RecordInstanceType } from '../models/Record.types'
import Record from '../models/Record'

export const mapRecordDataToModel = (record: RecordDataType): Record => {
  const recordData = JSON.parse(record.data).map(
    (data: RecordInstanceType) => new RecordInstance(data.timeStamp, data.data),
  )
  return new Record(
    recordData,
    record.recordSessionId,
    record.id,
    record.dateTimeCreated,
    record.dateTimeUpdated,
  )
}
