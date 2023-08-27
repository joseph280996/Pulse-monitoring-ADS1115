import RecordInstance from '../models/RecordInstance'
import { RecordDataType } from '../models/Record.types'
import { RecordInstanceType } from '../models/RecordInstance.types'
import Record from '../models/Record'

/** Map the response of database query to domain layer models
 * @param record - The Record object from the database query response
 * @returns The Record object
 */
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
