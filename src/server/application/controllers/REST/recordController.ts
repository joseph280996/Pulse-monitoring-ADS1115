import express, { RequestHandler, Router } from 'express'
import RecordSessionRepository from '../../../domain/repositories/RecordSessionRepository'

class RecordController {
  constructor(
    private recordRepo: RecordSessionRepository = new RecordSessionRepository(),
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

  private registerRoutes() {
    this.router.get('/:id', this.getById)
  }
  //#endregion
}

export default RecordController
