/* eslint-disable no-await-in-loop, import/no-extraneous-dependencies */
import dotenv from 'dotenv'
import {
  startSendingSensorValueLoop,
  stopGetSensorValueLoop,
} from '../handlers/webSocket/sensorValueHandler'
import { WebsocketMessageTypeHandler } from './wsController.types'

dotenv.config()

export default [
  {
    regExp: /start/i,
    handler: startSendingSensorValueLoop,
  },
  {
    regExp: /stop/i,
    handler: stopGetSensorValueLoop,
  },
] as WebsocketMessageTypeHandler[]
