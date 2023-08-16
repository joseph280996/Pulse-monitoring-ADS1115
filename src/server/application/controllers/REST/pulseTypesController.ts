import express, { RequestHandler, Router } from 'express'
import DBInstance, { DB } from '../../../domain/models/DbConnectionModel'
import PulseType from '../../../domain/models/PulseTypes'
import { PulseTypeDataType } from '../../../domain/models/PulseTypes.types'
import * as PulseTypeSqls from '../../../domain/sqls/pulseTypeSqls'

/** Pulse Types API controller
 *
 * List of all the HTTP requests that will be accepted by the endpoint
 * with a top level try-catch clause for appropriate status code update
 * and error handler
 */
class PulseTypesController {
  private static _instance: PulseTypesController

  public static get instance() {
    if (!PulseTypesController._instance) {
      PulseTypesController._instance = new PulseTypesController()
    }
    return PulseTypesController._instance
  }

  constructor(
    public router: Router = express.Router(),
    private db: DB = DBInstance,
  ) {
    if (PulseTypesController._instance) {
      throw new Error(
        'This is a singleton class. Called instance property instead of initializing a new instance',
      )
    }

    router.get('/', this.getPulseTypes)
  }

  //#region Public Methods
  getPulseTypes: RequestHandler = async (_req, res) => {
    const pulseTypes = await this.db
      .query<PulseTypeDataType[], void>(PulseTypeSqls.GET_ALL)
      .then((result: PulseTypeDataType[]) => {
        if (result?.length > 0) {
          return result.map((row: PulseTypeDataType) => new PulseType(row))
        }
        return []
      })
    res.status(200).send(pulseTypes)
  }
  //#endregion
}

export default PulseTypesController
