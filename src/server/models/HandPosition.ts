import db from '../db'
import * as HandPositionSqls from '../sqls/handPositionSqls'

type HandPositionConstructorParamType = {
  id: number
  name: string
}

class HandPosition {
  public id!: number

  public name!: string

  constructor(obj: HandPositionConstructorParamType) {
    this.id = obj.id
    this.name = obj.name
  }

  static async loadAll(): Promise<HandPosition[] | undefined[]> {
    const result = await db.query(HandPositionSqls.GET_ALL)
    return result?.length > 0
      ? result.map((row: any) => new HandPosition(row))
      : []
  }
}

export default HandPosition
