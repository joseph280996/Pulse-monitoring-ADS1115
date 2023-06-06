const fields = `
  Id as id,
  dateTimeCreated,
  dateTimeUpdated,
  PulseTypeId as pulseTypeId,
  HandPositionId as handPositionId,
  PatientId as patientId
  `
export const GET_BY_ID = `SELECT ${fields} FROM Diagnosis WHERE id = ?;`
export const GET_BY_ID_WITH_RECORD = `
  SELECT ${fields} 
  FROM Diagnosis 
  WHERE id = ?;
`
export const GET_ALL = `SELECT ${fields} FROM Diagnosis WHERE Id > 0;`
export const GET_BY_DATE_RANGE = `SELECT ${fields} FROM Diagnosis WHERE dateTimeCreated >= ? AND dateTimeCreated <= ?;`

export const CREATE_DIAGNOSIS = `
  INSERT INTO Diagnosis(PulseTypeId, PatientId)
  VALUES (?);
`

export const UPDATE_DIAGNOSIS = `
UPDATE Diagnosis SET ? WHERE Id = ?;
`
