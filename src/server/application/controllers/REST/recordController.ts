import express, { RequestHandler, Router } from 'express'
import RecordRepository from '../../../domain/repositories/RecordRepository'

class RecordController {
  constructor(
    private recordRepo: RecordRepository = RecordRepository.instance,
    private router: Router = express.Router(),
  ) {
    this.registerRoutes()
  }

  //#region public methods
  getById: RequestHandler = async (req, res) => {
    const { id: recordId } = req.params
    try {
      const record = await this.recordRepo.getById(Number(recordId))
      res.status(200).send(record)
    } catch (err) {
      console.error(`Record cannot be found with Id [${recordId}]`)
      res.status(400).send(`Record cannot be found with Id [${recordId}]`)
    }
  }

  getMostRecentRecord: RequestHandler = async (_, res) => {
    try {
      const record = await this.recordRepo.getLatest()
      res.status(200).send(record)
    } catch (err) {
      console.error('Cannot get latest record')
      res.status(500).send('Cannot get latest record')
    }
  }

  private registerRoutes() {
    this.router.get('/:id', this.getById)
  }
  //#endregion
}

export default RecordController
