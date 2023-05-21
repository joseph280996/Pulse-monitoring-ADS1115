const fields = 'Id as id, name'
// eslint-disable-next-line 
export const GET_ALL = `
    SELECT ${fields}
    FROM HandPosition
    `
