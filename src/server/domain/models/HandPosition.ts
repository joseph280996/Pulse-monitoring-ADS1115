import { HandPositionType } from './HandPosition.types'

class HandPosition {
  //#region Properties
  public id!: number
  public name!: string
  //#endregion

  //#region Constructor
  constructor(obj: HandPositionType) {
    this.id = obj.id
    this.name = obj.name
  }
  //#endregion
}

export default HandPosition
