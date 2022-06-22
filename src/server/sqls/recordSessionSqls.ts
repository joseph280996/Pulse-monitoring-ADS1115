export const fields = `
id, HandPositionID as handPositionID, PiezoelectricRecordID as piezoelectricRecordID, EcgRecordID as ecgRecordID
`

export const GET_BY_ID = `SELECT ${fields} FROM RecordSession WHERE id =?;`

export const CREATE_RECORD_SESSION =
  'INSERT INTO RecordSession(PiezoelectricRecordID, EcgRecordID, HandPositionID) VALUES (?);'

export const UPDATE_RECORD_SESSION = 'UPDATE RecordSession SET ? WHERE id = ?;'
