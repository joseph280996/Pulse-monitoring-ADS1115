export const fields = `
  id, data, DiagnosisId as diagnosisId, dateTimeCreated, dateTimeUpdated
`
export const GET_BY_ID = `SELECT ${fields} FROM Record WHERE id = ?;`
export const GET_BY_DIAGNOSIS_ID = `SELECT ${fields} FROM Record WHERE DiagnosisId = ?;`
export const GET_BY_DIAGNOSIS_ID_AND_TYPE = `SELECT ${fields} FROM Record WHERE DiagnosisId = ? AND typeId = ?;`
export const GET_LATEST = `SELECT ${fields} FROM Record WHERE id > 0 ORDER BY dateTimeCreated DESC LIMIT1;`

export const CREATE_RECORD_DATA =
  'INSERT INTO Record(data, DiagnosisId) VALUES (?);'
export const UPDATE_DIAGNOSIS_ID = `
  UPDATE Record SET DiagnosisId = ? WHERE id = ?;
`
export const AUDIT_RECORD = 'INSERT INTO RecordAudit VALUES (?);'
