import { RequestHandler } from 'express'
import Record from '../models/Record'

/**
 * #########################
 * # Get Request Handlers #
 * #########################
 */
const getByID: RequestHandler = async (req, res) => {
  const { id: recordId } = req.params
  const record = await Record.getByID(Number(recordId))
  if (!record) {
    res.status(400).send('The request record id does not exist')
  }
  res.status(200).send(record)
}

export default getByID
