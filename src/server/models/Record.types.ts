import { RecordedData } from '../types'

export type RecordDataType = {
  id?: number
  typeID: number
  data: string
  dateTimeCreated?: string
  dateTimeUpdated?: string
}

export interface RecordType extends Omit<RecordDataType, 'data'> {
  data: RecordedData[]
}
