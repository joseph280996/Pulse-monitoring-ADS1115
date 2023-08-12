import express, { RequestHandler, Router } from 'express'
import DBInstance, { DB } from '../../../domain/models/DbConnectionModel'
import HandPosition from '../../../domain/models/HandPosition'
import { HandPositionType } from '../../../domain/models/HandPosition.types'
import * as HandPositionSqls from '../../../domain/sqls/handPositionSqls'

/**
 * Hand Positions API controller
 *
 * List of all the HTTP requests that will be accepted by the endpoint
 * with a top level try-catch clause for appropriate status code update 
 * and error handler
 */
class HandPositionsController {
  private static _instance: HandPositionsController

  public static get instance(): HandPositionsController {
    if (!HandPositionsController._instance) {
      HandPositionsController._instance = new HandPositionsController()
    }
    return HandPositionsController._instance
  }

  constructor(
    public router: Router = express.Router(),
    private db: DB = DBInstance,
  ) {
    this.registerRoutes()
  }

  //#region Public Methods

  /**
   * Returns all the possible hand positions
   * @returns A list of known hand positions in the database
   */
  getHandPositions: RequestHandler = async (_req, res) => {
    try {
      const result = await this.db.query<HandPositionType[], void>(
        HandPositionSqls.GET_ALL,
      )
      const handPositions =
        result?.length > 0
          ? result.map((row: HandPositionType) => new HandPosition(row))
          : []
      res.status(200).send(handPositions)
    } catch (err) {
      console.error(err)
      res.status(500).send('Internal Error')
    }
  }
  //#endregion

  //#region Private Methods
  private registerRoutes() {
    this.router.get('/', this.getHandPositions)
  }
  //#endregion
}
export default HandPositionsController
