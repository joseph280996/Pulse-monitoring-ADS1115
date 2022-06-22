export type DiagnosisDataType = {
  id?: number
  pulseTypeID?: number
  patientID?: number
  recordSessionID?: number
  dateTimeCreated?: string
  dateTimeUpdated?: string
}

export type GetDiagnosisByRangeInputType = {
  startDate: string
  endDate: string
}
