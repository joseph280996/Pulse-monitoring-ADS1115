import express, { RequestHandler, Router } from 'express'
import DBInstance, { DB } from '../../../domain/models/DbConnectionModel'
import PulseType from '../../../domain/models/PulseTypes'
import { PulseTypeDataType } from '../../../domain/models/PulseTypes.types'
import * as PulseTypeSqls from '../../../domain/sqls/pulseTypeSqls'

class PulseTypesController {
  private static _instance: PulseTypesController;

  public static get instance(){
    if (!PulseTypesController._instance){
      PulseTypesController._instance = new PulseTypesController();
    }
    return PulseTypesController._instance;
  }

  constructor(
    public router: Router = express.Router(),
    private db: DB = DBInstance
  ){
    router.get("/", this.getPulseTypes)
  }

  //#region public methods
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
