import db from '../db'

type PulseTypeConstructor = {
  id: number
  pulseName: string
}

class PulseType {
  private static sqlFields = 'id, pulseName'

  _id!: number

  get id(): number {
    return this._id
  }

  _pulseName!: string

  get pulseName(): string {
    return this._pulseName
  }

  constructor(obj: PulseTypeConstructor) {
    this._id = obj.id
    this._pulseName = obj.pulseName
  }

  static loadAll = async (): Promise<PulseType[]> =>
    db
      .query(`SELECT ${PulseType.sqlFields} FROM PulseType`)
      .then((result: any) => {
        if (result?.length > 0) {
          return result.map((row: any) => new PulseType(row))
        }
        return []
      })
}

export default PulseType
