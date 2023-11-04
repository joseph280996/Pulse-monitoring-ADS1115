import { RecordSessionDataType } from '../models/RecordSession.types'
import RecordSession from '../models/RecordSession'

export const mapRecordSessionDataToModel = (recordSessionData: RecordSessionDataType):RecordSession => {
  return new RecordSession(
    recordSessionData.diagnosisId,
    recordSessionData.recordTypeId,
    recordSessionData.id,
    recordSessionData.dateTimeCreated,
    recordSessionData.dateTimeUpdated,
  )
}
