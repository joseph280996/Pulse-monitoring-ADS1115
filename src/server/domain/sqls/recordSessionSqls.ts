export const fields = `
  Id as id, DiagnosisId as diagnosisId, RecordTypeId as recordTypeId, dateTimeCreated, dateTimeUpdated
`
export const GET_BY_ID = `SELECT ${fields} FROM RecordSession WHERE Id = ?;`

export const GET_BY_DIAGNOSIS_ID_AND_TYPE = `SELECT ${fields} FROM RecordSession WHERE DiagnosisId = ? AND RecordTypeId = ?;`

export const GET_WITH_RECORDS_BY_DIANGOSIS_ID_AND_TYPE = `
  SELECT 
  RecordSession.Id as id, 
  RecordSession.DiagnosisId as diagnosisId, 
  RecordSession.RecordTypeId as recordTypeId, 
  RecordSession.dateTimeCreated as sessionDateTimeCreated, 
  RecordSession.dateTimeUpdated as sessionDateTimeUpdated,
  Record.Id as recordId, 
  Record.data as data,
  RecordSessionId as recordSessionId, 
  Record.dateTimeCreated as recordDateTimeCreated,
  Record.dateTimeUpdated as recordDateTimeUpdated
  FROM RecordSession 
  INNER JOIN Record ON RecordSession.Id = Record.RecordSessionId
  WHERE DiagnosisId = ? AND RecordTypeId = ?
  ORDER BY RecordSession.Id;`

export const GET_LATEST = `SELECT ${fields} FROM RecordSession WHERE id > 0 ORDER BY dateTimeCreated DESC LIMIT1;`

export const CREATE_RECORD_DATA =
  'INSERT INTO RecordSession(DiagnosisId, RecordTypeId) VALUES (?);'
