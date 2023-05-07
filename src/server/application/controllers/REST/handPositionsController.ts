import express, { RequestHandler, Router } from 'express'
import DBInstance, { DB } from '../../../domain/models/DbConnectionModel'
import HandPosition from '../../../domain/models/HandPosition'
import { HandPositionType } from '../../../domain/models/HandPosition.types'
import * as HandPositionSqls from '../../../domain/sqls/handPositionSqls'

class HandPositionsController {
  private static _instance: HandPositionsController;

  public static get instance(): HandPositionsController{
    if (!HandPositionsController._instance) {
      HandPositionsController._instance = new HandPositionsController();
    }
    return HandPositionsController._instance;
  }

  constructor(
    public router: Router = express.Router(),
    private db: DB = DBInstance
  ){
    this.registerRoutes()
  }

  //#region public methods
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
  private registerRoutes(){
    this.router.get('/', this.getHandPositions)
  }
}
export default HandPositionsController
