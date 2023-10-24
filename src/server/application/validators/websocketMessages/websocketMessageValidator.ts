import wsOperationTypes from '../../../infrastructure/variables/wsOperationTypes'

export const messageValidator = (message: string) => {
  const separatorIdx = message.indexOf(';')
  if (separatorIdx < 0) {
    throw new Error(
      "Invalid message received. Expected character ';' in the messsage",
    )
  }
  const [operation, data] = message.split(';')
  const isValidOperation = Object.values(wsOperationTypes).includes(operation)
  if (!isValidOperation) {
    throw new Error(
      `Invalid Operation requested. Received operation [${operation}]`,
    )
  }

  return [operation, data]
}
