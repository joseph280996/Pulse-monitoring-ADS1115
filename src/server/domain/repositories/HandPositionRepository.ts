import HandPosition from '../models/HandPosition'
import DBInstance, { DB } from '../models/DbConnectionModel'
import IRepository from '../interfaces/IRepository'
import * as HandPositionSqls from '../sqls/handPositionSqls'
import { HandPositionType } from '../models/HandPosition.types'

class HandPositionRepository
  implements IRepository<unknown, HandPosition | null> {
  //#region properties
  db!: DB

  private static _instance: HandPositionRepository
  //#endregion

  //#region getters
  static get instance(): HandPositionRepository {
    if (!this._instance) {
      this._instance = new HandPositionRepository()
    }
    return this._instance
  }
  //#endregion

  //#region constructor
  constructor(db = DBInstance) {
    this.db = db
  }

  create(): Promise<HandPosition | null> {
    throw new Error('Method not implemented.')
  }

  update(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  //#endregion

  //#region public methods

  async getAll(): Promise<HandPosition[]> {
    const res: HandPositionType[] = await this.db.query<HandPositionType[], []>(
      HandPositionSqls.GET_ALL,
      [],
    )
    return res && res.length > 0
      ? res.map((row: HandPositionType) => new HandPosition(row))
      : []
  }

  async getById(): Promise<HandPosition | null> {
    throw new Error('Not yet implemented')
  }

  //#endregion
}
export default HandPositionRepository
