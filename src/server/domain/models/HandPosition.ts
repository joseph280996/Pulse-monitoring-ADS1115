import { HandPositionType } from './HandPosition.types'

class HandPosition {
  //#region properties
  public id!: number
  public name!: string
  //#endregion

  //#region constructor
  constructor(obj: HandPositionType) {
    this.id = obj.id
    this.name = obj.name
  }
  //#endregion
}

export default HandPosition
