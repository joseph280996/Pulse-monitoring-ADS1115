import { Moment } from 'moment'
import { RecordedData } from '../types'

export type RecordFieldsType = {
  id?: number
  pulseTypeID?: number
  handPositionID: number
  data: RecordedData[]
  patientID?: number
}

export type GetRecordByRangeInputType = {
  startDate: Moment
  endDate: Moment
}
