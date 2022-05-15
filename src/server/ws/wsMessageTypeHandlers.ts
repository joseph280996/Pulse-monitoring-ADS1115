/* eslint-disable no-await-in-loop, import/no-extraneous-dependencies */
import dotenv from 'dotenv'
import WebSocket from 'ws'
import {
  startGetSensorValueLoop,
  stopGetSensorValueLoop,
} from './sensorValueHandler'

export type WebsocketMessageTypeHandler = {
  regExp: RegExp
  handler: (message: string, ws: WebSocket) => void
}

dotenv.config()

export default [
  {
    regExp: /start/i,
    handler: startGetSensorValueLoop,
  },
  {
    regExp: /stop/i,
    handler: stopGetSensorValueLoop,
  },
] as WebsocketMessageTypeHandler[]
