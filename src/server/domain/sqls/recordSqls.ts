const sqlFields =
  'Id as id, DiagnosisId as diagnosisId, data, dateTimeCreated, dateTimeUpdated, RecordTypeId as recordTypeId'

export const CREATE_RECORD_DATA = `
    INSERT INTO Record(data, RecordTypeId)
    VALUES (?);
`

export const GET_BY_DIAGNOSIS_ID = `
    SELECT ${sqlFields} FROM Record
    WHERE DiagnosisId = ?;
`

