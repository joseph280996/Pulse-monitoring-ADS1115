import db from '../db'

type HandPositionConstructorParamType = {
  id: number
  name: string
}

class HandPosition {
  private static fields = `id, name`
  private _id!: number

  get id(): number {
    return this._id
  }

  private _name!: string

  get name(): string {
    return this._name
  }

  constructor(obj: HandPositionConstructorParamType) {
    this._id = obj.id
    this._name = obj.name
  }

  static async loadAll() {
    const result = await db.query(`
    SELECT ${HandPosition.fields}
    FROM HandPosition
    `)
    return result?.length > 0
      ? result.map((row: any) => new HandPosition(row))
      : []
  }
}

export default HandPosition
