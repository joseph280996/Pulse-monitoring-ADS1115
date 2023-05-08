import { NextFunction, Request, Response } from 'express'
import RecordRepository from '../../../domain/repositories/RecordRepository'

//#region properties
const recordRepo = RecordRepository.instance
//#endregion

//#region public methods
async function validateRecordId(recordId: number) {
  const isRecordExist = await recordRepo.getById(recordId)
  if (!isRecordExist) {
    throw new Error(`Cannot find Record with Id [${recordId}]`)
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { recordId } = req.body
  try {
    await validateRecordId(recordId)
    next()
  } catch (error) {
    res.status(400).send((error as Error).message)
  }
}
//#endregion
