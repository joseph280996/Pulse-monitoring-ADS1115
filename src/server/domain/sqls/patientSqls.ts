const sqlFields = 'Patient.id, Patient.firstName, Patient.lastName'

export const CREATE_PATIENT = `
        INSERT INTO Patient(firstName, lastName)
        VALUES (?)
      `
export const GET_ALL = `
    SELECT ${sqlFields}
    FROM Patient
    WHERE id > 0;
    `
export const GET_BY_ID = `
      SELECT ${sqlFields}
      FROM Patient
      WHERE id = ?;
    `
export const GET_BY_FIRST_LAST_NAME = `
      SELECT ${sqlFields}
      FROM Patient
      WHERE firstName LIKE ? AND lastName LIKE ?
      LIMIT 1;
      `
