export type RecordSessionDataType = {
  id?: number
  data: string
  recordTypeId: number
  diagnosisId: number
  dateTimeCreated?: string
  dateTimeUpdated?: string
}

export type RecordDataType = {
  timeStamp: number
  data: number
}
