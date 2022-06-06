import moment from 'moment'
import WebSocket from 'ws'
import IntervalController from '../IntervalController'
import LoopHandler from '../models/LoopHandler'
import Record from '../models/Record'
import { RecordedData, SENSOR_LOOP_STATUS } from '../types'
import getLastNElementsFromRecordedData from '../utils/functions/getLastNElementsFromRecordedData'
import getRecordedDataBetweenTimeStamp from '../utils/functions/getRecordedDataBetweenTimeStamp'
import RECORD_TYPES from '../utils/variables/recordTypes'
import WS_MESSAGE_TYPE from '../utils/variables/wsMessageType'

type StopGetSensorValueLoopRequestData = {
  startTime: number
  endTime: number
  handPositionID: number
}
const INTERVAL_NAME = 'sendingDataInterval'
let store: RecordedData[][] = [[]]
let storeIdx = 0

const fakeGenerateRandomData = () =>
  new Promise((resolve: (param: number) => void) => {
    setTimeout(() => resolve(Math.random()), 100)
  })

export const startGettingSensorValueLoop = () => {
  LoopHandler.start()
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const i2c = await import('i2c-bus')
      // eslint-disable-next-line import/no-extraneous-dependencies
      const ADS1115 = await import('ads1115')
      const bus = i2c.openPromisified(1)
      const ads1115 = ADS1115(bus)
      while (LoopHandler.status() === SENSOR_LOOP_STATUS.STARTED) {
        if (store[storeIdx].length >= 10) {
          store.push([])
          storeIdx += 1
        }
        store[storeIdx].push({
          timeStamp: moment.utc().valueOf(),
          // eslint-disable-next-line no-await-in-loop
          data: await ads1115.measure('0+GND'),
        })
      }
    })()
  } else {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      while (LoopHandler.status() === SENSOR_LOOP_STATUS.STARTED) {
        if (store[storeIdx].length >= 10) {
          store.push([])
          storeIdx += 1
        }
        store[storeIdx].push({
          timeStamp: moment.utc().valueOf(),
          // eslint-disable-next-line no-await-in-loop
          data: await fakeGenerateRandomData(),
        })
      }
    })()
  }
}

export const startSendingSensorValueLoop = (_: string, ws: WebSocket) => {
  LoopHandler.start()

  // eslint-disable-next-line @typescript-eslint/no-extra-semi
  // eslint-disable-next-line semi-style
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const i2c = await import('i2c-bus')
      // eslint-disable-next-line import/no-extraneous-dependencies
      const ADS1115 = await import('ads1115')
      const bus = i2c.openPromisified(1)
      const ads1115 = ADS1115(bus)
      while (LoopHandler.status() === SENSOR_LOOP_STATUS.STARTED) {
        if (store[storeIdx].length >= 10) {
          store.push([])
          storeIdx += 1
        }
        store[storeIdx].push({
          timeStamp: moment.utc().valueOf(),
          // eslint-disable-next-line no-await-in-loop
          data: await ads1115.measure('0+GND'),
        })
      }
    })()
  } else {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(async () => {
      while (LoopHandler.status() === SENSOR_LOOP_STATUS.STARTED) {
        if (store[storeIdx].length >= 10) {
          store.push([])
          storeIdx += 1
        }
        store[storeIdx].push({
          timeStamp: moment.utc().valueOf(),
          // eslint-disable-next-line no-await-in-loop
          data: await fakeGenerateRandomData(),
        })
      }
    })()
  }
  try {
    IntervalController.registerInterval(
      INTERVAL_NAME,
      setInterval(() => {
        console.log(store)
        console.log('Sending RecordedData')
        ws.send(
          JSON.stringify({
            type: WS_MESSAGE_TYPE.RECORDED_DATA,
            recordedData: getLastNElementsFromRecordedData(
              store[storeIdx].length < 1000
                ? [
                    ...(store.length > 1 ? store[store.length - 1] : []),
                    ...store[storeIdx],
                  ]
                : store[storeIdx],
              20,
            ),
          }),
        )
      }, 200),
    )
  } catch (error) {
    IntervalController.clear(INTERVAL_NAME)
    console.error(error)
  }
}
export const stopGetSensorValueLoop = async (
  message: string,
  ws: WebSocket,
) => {
  LoopHandler.stop()
  IntervalController.clear(INTERVAL_NAME)
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
    typeID: RECORD_TYPES.PIEZOELECTRIC_SENSOR,
    handPositionID: parsedRecordedTime.handPositionID,
    data: recordedValues,
  })
  const savedRecord = await newRecord.save()

  store = [[]]
  ws.send(
    JSON.stringify({
      type: WS_MESSAGE_TYPE.RECORD_ID,
      recordID: savedRecord.id,
    }),
  )
}
