import HandPosition from '../models/HandPosition'
import DBInstance, { DB } from '../models/DbConnectionModel'
import IRepository from '../interfaces/IRepository'

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
    const res: HandPosition[] = await this.db.query<DiagnosisDto[], []>(
      DiagnosisSqls.GET_ALL,
      [],
    )
    return res && res.length > 0
      ? res.map((row: DiagnosisDto) => new Diagnosis(row))
      : []
  }

  async getById(id: number) {
    const res: DiagnosisDto = await this.db.query<DiagnosisDto, [number]>(
      DiagnosisSqls.GET_BY_ID,
      [id],
    )
    return res ? new Diagnosis(res) : null
  }
  //#endregion
}
export default DiagnosisRepository
