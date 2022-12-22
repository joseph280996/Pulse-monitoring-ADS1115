/* eslint-disable no-await-in-loop*/
import dotenv from 'dotenv'
import {
  startSendingSensorValueLoop,
  stopGetSensorValueLoop,
} from 'src/server/application/handlers/webSocket/sensorValueHandler'
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
