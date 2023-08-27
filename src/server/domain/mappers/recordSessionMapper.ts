import { RecordSessionDataType } from '../models/RecordSession.types'
import RecordSession from '../models/RecordSession'
import { mapRecordDataToModel } from './recordDataMapper'

/** Map the RecordSession with Record response from database query
 * to Domain layer's models
 *
 * @param res - The RecordSession rows from the database query
 * @returns The list of RecordSessions with Record
 */
export const mapRecordSessionWithRecord = (res:RecordSessionDataType[]) => {
  let prevSessionId = 0
  let currentSession: RecordSession
  const sessions = res.reduce((sessions: Array<RecordSession>, row: RecordSessionDataType) => {
    if (row.id != prevSessionId) {
      prevSessionId = row.id as number
      currentSession = new RecordSession(
        row.diagnosisId,
        row.recordTypeId,
        row.id,
        row.dateTimeCreated,
        row.dateTimeUpdated,
      )
      sessions.push(currentSession)
    }

    const record = mapRecordDataToModel({
      id: row.recordId,
      recordSessionId: row.recordSessionId as number,
      dateTimeCreated: row.recordDateTimeCreated,
      dateTimeUpdated: row.recordDateTimeUpdated,
      data: row.data as string,
    })

    currentSession.records = (currentSession.records || []).concat(record.data)

    return sessions
  }, [])

  return sessions
}

export const mapRecordSession = (
  recordSessionData: RecordSessionDataType,
): RecordSession => {
  return new RecordSession(
    recordSessionData.diagnosisId,
    recordSessionData.recordTypeId,
    recordSessionData.id,
    recordSessionData.dateTimeCreated,
    recordSessionData.dateTimeUpdated,
  )
}
