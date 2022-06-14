import { PulseTypeType } from './PulseTypes.type'

class PulseType {
  id!: number

  name!: string

  chineseName!: string

  features!: string

  constructor(obj: PulseTypeType) {
    this.chineseName = obj.chineseName
    this.id = obj.id
    this.name = obj.name
    this.features = obj.features
  }
}

export default PulseType
