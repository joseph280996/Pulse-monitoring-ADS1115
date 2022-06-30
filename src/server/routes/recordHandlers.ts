import { RequestHandler } from 'express'
import Record from '../models/Record'
import RecordSession from '../models/RecordSession'
import RecordRepository from '../repositories/RecordRepository'
import RecordSessionRepository from '../repositories/RecordSessionRepository'

// Private methods
function guardAgainstInvalidRecordSession(
  recordSession?: RecordSession | null,
  record?: Record | null,
) {
  if (!recordSession) {
    throw new Error('Record session not found')
  }
  if (!record) {
    throw new Error('Record failed to create')
  }
  if (!recordSession.piezoelectricRecordID) {
    console.warn('Record Session does not have piezoelectric record')
  }
}

/**
 * #########################
 * # Get Request Handlers #
 * #########################
 */
export const getByID: RequestHandler = async (req, res) => {
  const { id: recordSessionID } = req.params
  try {
    const recordSession = await RecordSessionRepository.getByIDWithRecords(
      Number(recordSessionID),
    )
    res.status(200).send(recordSession)
  } catch (err) {
    console.error(`Record cannot be found with ID [${recordSessionID}]`)
    res.status(400).send(`Record cannot be found with ID [${recordSessionID}]`)
  }
}

/**
 * #########################
 * # Post Request Handlers #
 * #########################
 */
export const createEcgRecord: RequestHandler = async (req, res) => {
  const { sessionID, data, typeID } = req.body
  try {
    const recordSessionData = await RecordSessionRepository.getByID(sessionID)
    const newRecord = await RecordRepository.create({
      data,
      typeID,
    })
    guardAgainstInvalidRecordSession(recordSessionData, newRecord)
    const recordSession = recordSessionData as RecordSession
    await RecordSessionRepository.update({
      id: recordSession.id,
      ecgRecordID: newRecord.id,
      handPositionID: recordSession.handPositionID,
      piezoelectricRecordID: recordSession.piezoelectricRecordID,
    })

    res.status(200).send({ status: 'successfull' })
  } catch (error) {
    res.status(500).send(`Record cannot be found with ID [${sessionID}]`)
  }
}
