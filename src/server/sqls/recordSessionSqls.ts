export const fields = `
id, HandPositionID as handPositionID, PiezoelectricRecordID as piezoelectricRecordID, EcgRecordID as ecgRecordID
`

export const GET_BY_ID = `SELECT ${fields} FROM RecordSession WHERE id =?;`
export const GET_BY_ID_WITH_RECORD = `
SELECT 
  RecordSession.id as recordSessionID,
  HandPositionID as handPositionID, EcgRecordID as ecgRecordID,
  RecordSession.dateTimeCreated as sessionDateTimeCreated, RecordSession.dateTimeUpdated as sessionDateTimeUpdated,
  Record.id as piezoelectricRecordID,
  typeID, data, 
  Record.dateTimeCreated as recordDateTimeCreated, Record.dateTimeUpdated as recordDateTimeUpdated
FROM RecordSession INNER JOIN Record ON RecordSession.PiezoelectricRecordID = Record.id
WHERE RecordSession.id = ?;`

export const CREATE_RECORD_SESSION =
  'INSERT INTO RecordSession(PiezoelectricRecordID, EcgRecordID, HandPositionID) VALUES (?);'

export const UPDATE_RECORD_SESSION = 'UPDATE RecordSession SET ? WHERE id = ?;'
