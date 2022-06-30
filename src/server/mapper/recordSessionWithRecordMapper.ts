import RecordSession from '../models/RecordSession'
import { pick } from 'lodash'
import Record from '../models/Record'

type RecordSessionWithRecordData = {
  recordSessionID: number
  handPositionID: number
  piezoelectricRecordID: number
  sessionDateTimeCreated: string
  sessionDateTimeUpdated: string
  ecgRecordID: number
  typeID: number
  data: string
  recordDateTimeCreated: string
  recordDateTimeUpdated: string
}

export default (
  recordSessionData: RecordSessionWithRecordData,
): RecordSession => {
  const recordSession = new RecordSession({
    id: recordSessionData.recordSessionID,
    dateTimeCreated: recordSessionData.sessionDateTimeCreated,
    dateTimeUpdated: recordSessionData.sessionDateTimeUpdated,
    ...pick(recordSessionData, ['handPositionID', 'piezoelectricRecordID']),
  })
  const piezoelectricRecord = new Record({
    id: recordSession.piezoelectricRecordID,
    typeID: recordSessionData.typeID,
    data: JSON.parse(recordSessionData.data),
    dateTimeCreated: recordSessionData.recordDateTimeCreated,
    dateTimeUpdated: recordSessionData.recordDateTimeUpdated,
  })
  recordSession.piezoelectricRecord = piezoelectricRecord
  return recordSession
}
