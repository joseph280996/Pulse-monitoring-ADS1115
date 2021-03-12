/* eslint-disable no-await-in-loop */
import ADS1115 from 'ads1115'
import i2c from 'i2c-bus'
import moment, { Moment } from 'moment'

export type WebsocketMessageTypeHandler = {
  regExp: RegExp
  handler: (message: string, ws: WebSocket) => void
}

type RecordedData = {
  timeStamp: Moment
  data: number
}

let isLoopStart = false
let store: RecordedData[] = []
let interval: NodeJS.Timeout

export default [
  {
    regExp: /start/i,
    handler: (_: string, ws: WebSocket) => {
      isLoopStart = true
      i2c.openPromisified(1).then(async (bus) => {
        const ads1115 = ADS1115(bus)
        while (isLoopStart) {
          store.push({
            timeStamp: moment.utc(),
            data: await ads1115.measure('0+GND'),
          })
        }
      })
      interval = setInterval(() => {
        ws.send(JSON.stringify({ recordedData: store }))
        store = []
      }, 200)
    },
  },
  {
    regExp: /stop/i,
    handler: () => {
      isLoopStart = false
      if (interval) {
        clearInterval(interval)
      }
    },
  },
] as WebsocketMessageTypeHandler[]
