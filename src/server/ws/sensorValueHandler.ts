import moment from 'moment'
import WebSocket from 'ws'
import IntervalController from '../IntervalController'
import Record from '../models/Record'
import { RecordedData } from '../types'
import getLastNElementsFromRecordedData from '../utils/functions/getLastNElementsFromRecordedData'
import getRecordedDataBetweenTimeStamp from '../utils/functions/getRecordedDataBetweenTimeStamp'
import WS_MESSAGE_TYPE from '../utils/variables/wsMessageType'
import LoopHandler, { SENSOR_LOOP_STATUS } from './LoopHandler'

type StopGetSensorValueLoopRequestData = {
  startTime: number
  endTime: number
  handPositionID: number
}

const store: RecordedData[][] = [[]]

export const startGetSensorValueLoop = (_: string, ws: WebSocket) => {
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const i2c = await import('i2c-bus')
      // eslint-disable-next-line import/no-extraneous-dependencies
      const ADS1115 = await import('ads1115')
      const bus = i2c.openPromisified(1)
      const ads1115 = ADS1115(bus)
      let rowIdx = 0
      while (LoopHandler.status() === SENSOR_LOOP_STATUS.STARTED) {
        if (store[rowIdx].length >= 1000) {
          rowIdx += 1
        }
        store[rowIdx].push({
          timeStamp: moment.utc(),
          // eslint-disable-next-line no-await-in-loop
          data: await ads1115.measure('0+GND'),
        })
      }
    })()
  }
  try {
    IntervalController.registerInterval(
      'sendingDataInterval',
      setInterval(() => {
        ws.send(
          JSON.stringify({
            type: WS_MESSAGE_TYPE.RECORDED_DATA,
            recordedData: getLastNElementsFromRecordedData,
          }),
        )
      }, 200),
    )
  } catch (error) {
    IntervalController.clear('sendingDataInterval')
    console.error(error)
  }
}
export const stopGetSensorValueLoop = async (
  message: string,
  ws: WebSocket,
) => {
  LoopHandler.stop()
  IntervalController.clear('sendingDataInterval')
  const trimmedJSONValues = message.trim()
  const parsedRecordedTime: StopGetSensorValueLoopRequestData = JSON.parse(
    trimmedJSONValues,
  )
  const startTimeMoment = moment.utc(parsedRecordedTime.startTime)
  const endTimeMoment = moment.utc(parsedRecordedTime.endTime)

  const recordedValues: RecordedData[] = getRecordedDataBetweenTimeStamp(
    store,
    startTimeMoment,
    endTimeMoment,
  )
  const newRecord = new Record({
    handPositionID: parsedRecordedTime.handPositionID,
    data: recordedValues,
  })
  const savedRecord = await newRecord.save()
  ws.send(
    JSON.stringify({
      type: WS_MESSAGE_TYPE.RECORD_ID,
      recordID: savedRecord.id,
    }),
  )
}
