import { PulseTypeDataType } from './PulseTypes.types'

class PulseType {
  //#region properties
  id!: number
  name!: string
  chineseName!: string
  features!: string
  //#endregion

  //#region constructor
  constructor(obj: PulseTypeDataType) {
    this.chineseName = obj.chineseName
    this.id = obj.id
    this.name = obj.name
    this.features = obj.features
  }
  //#endregion
}

export default PulseType
