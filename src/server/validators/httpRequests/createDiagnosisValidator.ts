import { NextFunction, Request, Response } from 'express'
import RecordRepository from '../../repositories/RecordRepository'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { recordID } = req.body
  try {
    validateRecordID(recordID)
    next()
  } catch (error) {
    res.status(400).send((error as Error).message)
  }
}

async function validateRecordID(recordID: number) {
  const isRecordExist = await RecordRepository.getByID(recordID)
  if (!isRecordExist) {
    throw new Error(`Cannot find Record with ID [${recordID}]`)
  }
}
