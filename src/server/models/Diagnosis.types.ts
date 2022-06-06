import { Moment } from 'moment'

export type DiagnosisFieldsType = {
  id?: number
  pulseTypeID?: number
  patientID?: number
}

export type GetDiagnosisByRangeInputType = {
  startDate: Moment
  endDate: Moment
}
