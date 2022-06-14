import { Moment } from 'moment'

export type DiagnosisDataType = {
  id?: number
  pulseTypeID?: number
  patientID?: number
  piezoelectricRecordID: number
  ecgRecordID?: number
  dateTimeCreated?: string
  dateTimeUpdated?: string
}

export type GetDiagnosisByRangeInputType = {
  startDate: Moment
  endDate: Moment
}
