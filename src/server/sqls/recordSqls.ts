const fields = `
  id, data, dateTimeCreated, dateTimeUpdated, PulseTypeID, HandPositionID, PatientID
  `
export const GET_BY_ID = `SELECT ${fields} FROM Record WHERE id = ?;`
export const GET_BY_DATE_RANGE = `SELECT ${fields} FROM Record WHERE dateTimeCreated >= ? AND dateTimeCreated <= ?;`

export const CREATE_RECORD = `
      INSERT INTO Record(data, PulseTypeID, HandPositionID, PatientID)
      VALUES (?)
      `
