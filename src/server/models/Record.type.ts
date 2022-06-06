import { RecordedData } from '../types'

export type RecordType = {
  id?: number
  diagnosisID?: number
  typeID: number
  data: RecordedData[]
  handPositionID: number
}
