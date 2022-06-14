export const fields = `
id, HandPositionID as handPositionID, PiezoelectricRecordID as piezoelectricRecordID, EcgRecordID as ecgRecordID
`

export const GET_RECORD_SESSION_BY_ID = `SELECT ${fields} FROM RecordSession WHERE id =?;`

export const CREATE_RECORD_SESSION = 'INSERT INTO RecordSession VALUES (?);'
