import moment from 'moment'
import WebSocket from 'ws'
import LoopController from '../controllers/LoopController'
import IntervalController from '../IntervalController'
import RecordRepository from '../repositories/RecordRepository'
import { RecordedData, SENSOR_LOOP_STATUS } from '../types'
import getLastNElementsFromRecordedData from '../utils/functions/getLastNElementsFromRecordedData'
import getRecordedDataBetweenTimeStamp from '../utils/functions/getRecordedDataBetweenTimeStamp'
import WS_MESSAGE_TYPE from '../utils/variables/wsMessageType'
import i2c from 'i2c-bus'
import ADS1115 from 'ads1115'

type StopGetSensorValueLoopRequestData = {
  startTime: number
  endTime: number
  handPositionID: number
}
const INTERVAL_NAME = 'sendingDataInterval'
let store: RecordedData[][] = [[]]
let storeIdx = 0

/**
 * Handler to start getting and sending value from the sensor
 * @param _ WS message
 * @param ws WS instance
 */
export const startSendingSensorValueLoop = (_: string, ws: WebSocket) => {
  LoopController.start()

    ; (async () => {
      const bus = await i2c.openPromisified(1)
      const ads1115 = await ADS1115(bus)
      while (LoopController.status() === SENSOR_LOOP_STATUS.STARTED) {
        if (store[storeIdx].length >= 10) {
          store.push([])
          storeIdx += 1
        }
        const newData = await ads1115.measure('0+GND')
        store[storeIdx].push({
          timeStamp: moment.utc().valueOf(),
          data: newData
        })
      }
    })()
  try {
    IntervalController.registerInterval(
      INTERVAL_NAME,
      setInterval(() => {
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
  LoopController.stop()
  IntervalController.clear(INTERVAL_NAME)
  const trimmedJSONValues = message.trim()
  const parsedRecordedTime: StopGetSensorValueLoopRequestData = JSON.parse(
    trimmedJSONValues,
  )
  const { startTime, endTime, handPositionID } = parsedRecordedTime
  const startTimeMoment = moment.utc(startTime)
  const endTimeMoment = moment.utc(endTime)
  const recordedValues: RecordedData[] = getRecordedDataBetweenTimeStamp(
    store,
    startTimeMoment,
    endTimeMoment,
  )

  const newRecord = await RecordRepository.create({
    handPositionID: parsedRecordedTime.handPositionID,
    data: recordedValues,
    handPositionID,
  })

  if (!newRecord) {
    throw new Error('Error create piezoelectric record')
  }

  store = [[]]
  ws.send(
    JSON.stringify({
      type: WS_MESSAGE_TYPE.RECORD_ID,
      recordID: newRecord.id,
    }),
  )
}
