const fields = `
  id, dateTimeCreated, dateTimeUpdated, PulseTypeID, HandPositionID, PatientID
  `
export const GET_BY_ID = `SELECT ${fields} FROM Diagnosis WHERE id = ?;`
export const GET_BY_DATE_RANGE = `SELECT ${fields} FROM Diagnosis WHERE dateTimeCreated >= ? AND dateTimeCreated <= ?;`

export const CREATE_DIAGNOSIS = `
      INSERT INTO Diagnosis(PulseTypeID, PatientID,RecordSessionID)
      VALUES (?)
      `

export const UPDATE_DIAGNOSIS = `
UPDATE Diagnosis SET ? WHERE id = ?;
`
