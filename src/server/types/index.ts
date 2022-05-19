import { Moment } from 'moment'

export type RecordedData = {
  timeStamp: Moment
  data: number
}

export const SENSOR_LOOP_STATUS = {
  STARTED: 'started',
  STOPPED: 'stopped',
}
