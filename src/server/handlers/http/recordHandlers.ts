import { RequestHandler } from 'express'
import RecordRepository from '../../repositories/RecordRepository'

/**
 * #########################
 * # Get Request Handlers #
 * #########################
 */
export const getByID: RequestHandler = async (req, res) => {
  const { id: recordID } = req.params
  try {
    const record = await RecordRepository.getByID(Number(recordID))
    res.status(200).send(record)
  } catch (err) {
    console.error(`Record cannot be found with ID [${recordID}]`)
    res.status(400).send(`Record cannot be found with ID [${recordID}]`)
  }
}

export const getMostRecentRecord: RequestHandler = async (req, res) => {
  try {
    const record = await RecordRepository.getLatest()
    res.status(200).send(record)
  } catch (err) {
    console.error(`Cannot get latest record`)
    res.status(500).send(`Cannot get latest record`)
  }
}
