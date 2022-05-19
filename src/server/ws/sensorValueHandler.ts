import moment from 'moment'
import WebSocket from 'ws'
import IntervalController from '../IntervalController'
import LoopHandler from '../models/LoopHandler'
import Record from '../models/Record'
import { RecordedData, SENSOR_LOOP_STATUS } from '../types'
import getLastNElementsFromRecordedData from '../utils/functions/getLastNElementsFromRecordedData'
import getRecordedDataBetweenTimeStamp from '../utils/functions/getRecordedDataBetweenTimeStamp'
import WS_MESSAGE_TYPE from '../utils/variables/wsMessageType'

type StopGetSensorValueLoopRequestData = {
  startTime: number
  endTime: number
  handPositionID: number
}
const INTERVAL_NAME = 'sendingDataInterval'
const store: RecordedData[][] = [[]]
let dataToSend: RecordedData[] = []

const updateStore = async (getValueFn: () => Promise<number>) => {
  while (LoopHandler.status() === SENSOR_LOOP_STATUS.STARTED) {
    if (dataToSend.length >= 1000) {
      store.push(dataToSend)
      dataToSend = []
    }
    dataToSend.push({
      timeStamp: moment.utc(),
      // eslint-disable-next-line no-await-in-loop
      data: await getValueFn(),
    })
  }
}

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
      updateStore(() => ads1115.measure('0+GND'))
    })()
  } else {
    updateStore(() => new Promise((resolve) => resolve(Math.random())))
  }
  try {
    IntervalController.registerInterval(
      INTERVAL_NAME,
      setInterval(() => {
        console.log('Sending RecordedData')
        ws.send(
          JSON.stringify({
            type: WS_MESSAGE_TYPE.RECORDED_DATA,
            recordedData: getLastNElementsFromRecordedData(
              dataToSend.length < 1000
                ? [...store[store.length - 1], ...dataToSend]
                : dataToSend,
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
