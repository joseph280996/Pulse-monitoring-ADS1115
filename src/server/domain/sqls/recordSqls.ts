const sqlFields =
  'Id as id, RecordSessionId as recordSessionId, data, dateTimeCreated, dateTimeUpdated'

export const CREATE_RECORD_DATA = `
    INSERT INTO Record(data, RecordSessionId)
    VALUES (?);
`

export const GET_BY_SESSION_ID = `
    SELECT ${sqlFields} FROM Record
    WHERE RecordSessionId = ?;
`
