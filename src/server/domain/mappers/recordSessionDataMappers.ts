import Record from '../models/Record'
import { RecordDataType, RecordSessionDataType } from '../models/Record.types'
import RecordSession from '../models/RecordSession'

export const mapRecordDataToModel = (recordSession: RecordSessionDataType): RecordSession => {
    const recordData = JSON.parse(recordSession.data).map((data: RecordDataType) => new Record(data.timeStamp, data.data))
    return new RecordSession(
        recordData,
        recordSession.diagnosisId,
        recordSession.recordTypeId,
        recordSession.id,
        recordSession.dateTimeCreated,
        recordSession.dateTimeUpdated,
    )
}

export const mapRecordModelToData = (recordSession: RecordSession): RecordSessionDataType => {
    const serializedData = JSON.stringify(recordSession.records)
    return {
        id: recordSession.id,
        data: serializedData,
        recordTypeId: recordSession.recordTypeId,
        diagnosisId: recordSession.diagnosisId,
        dateTimeCreated: recordSession.dateTimeCreated,
        dateTimeUpdated: recordSession.dateTimeUpdated,
    }
}