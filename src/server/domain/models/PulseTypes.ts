import { PulseTypeDataType } from './PulseTypes.types'

class PulseType {
  //#region Properties
  id!: number
  name!: string
  chineseName!: string
  features!: string
  //#endregion

  //#region Constructor
  constructor(obj: PulseTypeDataType) {
    this.chineseName = obj.chineseName
    this.id = obj.id
    this.name = obj.name
    this.features = obj.features
  }
  //#endregion
}

export default PulseType
