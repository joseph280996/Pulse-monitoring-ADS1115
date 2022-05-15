import db from '../db'
import * as PulseTypeSqls from '../sqls/pulseTypeSqls'
import { PulseTypeFieldsType } from './PulseTypes.type'

class PulseType {
  id!: number

  name!: string

  chineseName!: string

  features!: string

  constructor(obj: PulseTypeFieldsType) {
    this.chineseName = obj.chineseName
    this.id = obj.id
    this.name = obj.name
    this.features = obj.features
  }

  static loadAll = async (): Promise<PulseType[] | undefined[]> =>
    db.query(PulseTypeSqls.GET_ALL).then((result: any) => {
      if (result?.length > 0) {
        return result.map((row: any) => new PulseType(row))
      }
      return []
    })
}

export default PulseType
