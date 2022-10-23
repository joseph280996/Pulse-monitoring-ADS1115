export const fields = `
  id, data, HandPositionID as handPositionID, dateTimeCreated, dateTimeUpdated
`
export const GET_BY_ID = `SELECT ${fields} FROM Record WHERE id = ?;`
export const GET_BY_DIAGNOSIS_ID = `SELECT ${fields} FROM Record WHERE DiagnosisID = ?;`
export const GET_BY_DIAGNOSIS_ID_AND_TYPE = `SELECT ${fields} FROM Record WHERE DiagnosisID = ? AND typeID = ?;`

export const CREATE_RECORD_DATA =
  'INSERT INTO Record(data, HandPositionID) VALUES (?);'
export const UPDATE_DIAGNOSIS_ID = `
  UPDATE Record SET DiagnosisID = ? WHERE id = ?;
`
export const AUDIT_RECORD = 'INSERT INTO RecordAudit VALUES (?);'
