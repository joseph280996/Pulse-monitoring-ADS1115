export const fields = `
  Id as id, data, DiagnosisId as diagnosisId, dateTimeCreated, dateTimeUpdated
`
export const GET_BY_ID = `SELECT ${fields} FROM Record WHERE Id = ?;`
export const GET_PIEZO_RECORDS_BY_DIAGNOSIS_ID = `SELECT ${fields} FROM Record WHERE DiagnosisId = ? AND RecordTypeId = ?;`
export const GET_BY_DIAGNOSIS_ID_AND_TYPE = `SELECT ${fields} FROM Record WHERE DiagnosisId = ? AND RecordTypeId = ?;`
export const GET_LATEST = `SELECT ${fields} FROM Record WHERE id > 0 ORDER BY dateTimeCreated DESC LIMIT1;`

export const CREATE_RECORD_DATA =
  'INSERT INTO Record(data, DiagnosisId, RecordTypeId) VALUES (?);'
export const UPDATE_DIAGNOSIS_ID = `
  UPDATE Record SET DiagnosisId = ? WHERE Id = ?;
`
export const AUDIT_RECORD = 'INSERT INTO RecordAudit VALUES (?);'
