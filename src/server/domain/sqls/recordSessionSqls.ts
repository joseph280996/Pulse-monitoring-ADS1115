export const fields = `
  Id as id, data, DiagnosisId as diagnosisId, dateTimeCreated, dateTimeUpdated
`
export const GET_BY_ID = `SELECT ${fields} FROM RecordSession WHERE Id = ?;`

export const GET_BY_DIAGNOSIS_ID_AND_TYPE = `SELECT ${fields} FROM RecordSession WHERE DiagnosisId = ? AND RecordTypeId = ?;`

export const GET_LATEST = `SELECT ${fields} FROM RecordSession WHERE id > 0 ORDER BY dateTimeCreated DESC LIMIT1;`

export const CREATE_RECORD_DATA =
  'INSERT INTO RecordSession(DiagnosisId, RecordTypeId) VALUES (?);'
