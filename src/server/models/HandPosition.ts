import { HandPositionType } from './HandPosition.types'

class HandPosition {
  public id!: number

  public name!: string

  constructor(obj: HandPositionType) {
    this.id = obj.id
    this.name = obj.name
  }
}

export default HandPosition
