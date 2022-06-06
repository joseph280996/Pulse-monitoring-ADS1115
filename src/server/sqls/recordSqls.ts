export const fields = 'id, data, typeID, DiagnosisID as diagnosisID'
export const GET_BY_ID = `SELECT ${fields} FROM RecordData WHERE id = ?;`
export const GET_BY_DIAGNOSIS_ID = `SELECT ${fields} FROM Record WHERE DiagnosisID = ?;`

export const CREATE_RECORD_DATA = 'INSERT INTO Record VALUES (?);'
export const UPDATE_DIAGNOSIS_ID = `
  UPDATE Record SET DiagnosisID = ? WHERE id = ?;
`
