import { RequestHandler } from 'express'
import RecordRepository from 'src/server/domain/repositories/RecordRepository'

const recordRepo = RecordRepository.instance
/**
 * #########################
 * # Get Request Handlers #
 * #########################
 */
export const getByID: RequestHandler = async (req, res) => {
  const { id: recordID } = req.params
  try {
    const record = await recordRepo.getByID(Number(recordID))
    res.status(200).send(record)
  } catch (err) {
    console.error(`Record cannot be found with ID [${recordID}]`)
    res.status(400).send(`Record cannot be found with ID [${recordID}]`)
  }
}

export const getMostRecentRecord: RequestHandler = async (_, res) => {
  try {
    const record = await recordRepo.getLatest()
    res.status(200).send(record)
  } catch (err) {
    console.error('Cannot get latest record')
    res.status(500).send('Cannot get latest record')
  }
}
