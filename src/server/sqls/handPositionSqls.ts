const fields = 'id, name'
// eslint-disable-next-line import/prefer-default-export
export const GET_ALL = `
    SELECT ${fields}
    FROM HandPosition
    `
