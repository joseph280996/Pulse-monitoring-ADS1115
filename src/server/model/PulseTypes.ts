import db from '../db'

type PulseTypeConstructor = {
  id: number
  pulseName: string
}

class PulseTypes {
  private static sqlFields = 'id, pulseName'

  _id!: number
  get id() {
    return this._id
  }

  _pulseName!: string
  get pulseName() {
    return this._pulseName
  }

  constructor(obj: PulseTypeConstructor) {
    this._id = obj.id
    this._pulseName = obj.pulseName
  }

  static loadAll = async () =>
    db
      .query(`SELECT ${PulseTypes.sqlFields} FROM PulseType`)
      .then((result: any) => {
        result?.length > 0 ? result.map((row: any) => new PulseTypes(row)) : []
      })
}

export default PulseTypes
