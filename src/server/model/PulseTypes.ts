import db from '../db'

type PulseTypeConstructor = {
  id: number
  pulseName: string
}

class PulseTypes {
  private sqlFields: string = `id, pulseName`

  private _id!: number

  get id() {
    return this._id
  }

  private _pulseName!: string

  get pulseName() {
    return this._pulseName
  }

  constructor(obj: PulseTypeConstructor) {
    this._id = obj.id
    this._pulseName = obj.pulseName
  }

  static loadAll() {
    db.query(`SELECT ${this.sqlFields} FROM PulseType`).then((result) => {
      console.log(result)
    })
  }
}
