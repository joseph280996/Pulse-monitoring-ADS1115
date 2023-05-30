export type RecordDataType = {
  id?: number
  data: string
  recordSessionId: number
  dateTimeCreated?: string
  dateTimeUpdated?: string
}

export type RecordSessionDataType = {
  id?: number
  recordTypeId: number
  diagnosisId: number
  dateTimeCreated?: string
  dateTimeUpdated?: string
}

export type RecordInstanceType = {
  timeStamp: number
  data: number
}
