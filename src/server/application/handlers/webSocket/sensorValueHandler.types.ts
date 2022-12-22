import { Moment } from 'moment'

export type RecordedData = {
  timeStamp: number
  data: number
}

export type StopGetSensorValueLoopRequestData = {
  startTime: number
  endTime: number
  handPositionID: number
}

export type EnrichedStopRequestData = {
  startTime: Moment
  endTime: Moment
  handPositionID: number
}
