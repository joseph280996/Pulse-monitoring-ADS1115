import { NextFunction, Request, Response } from 'express'
import RecordRepository from '../../../domain/repositories/RecordRepository'

//#region properties
const recordRepo = RecordRepository.instance
//#endregion

//#region public methods
async function validateRecordID(recordID: number) {
  const isRecordExist = await recordRepo.getByID(recordID)
  if (!isRecordExist) {
    throw new Error(`Cannot find Record with ID [${recordID}]`)
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { recordID } = req.body
  try {
    await validateRecordID(recordID)
    next()
  } catch (error) {
    res.status(400).send((error as Error).message)
  }
}
//#endregion
