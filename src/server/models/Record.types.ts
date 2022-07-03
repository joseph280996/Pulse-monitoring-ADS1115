import { RecordedData } from '../types'

export type RecordDataType = {
  id?: number
  data: string
  dateTimeCreated?: string
  dateTimeUpdated?: string
}

export interface RecordSessionType extends Omit<RecordDataType, 'data'> {
  data: RecordedData[]
}
