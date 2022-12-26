/* eslint-disable no-await-in-loop*/
import dotenv from 'dotenv'
import * as sensorHandler from '../../handlers/webSocket/sensorValueHandler'
import { WebsocketMessageTypeHandler } from './wsController.types'

dotenv.config()

export default [
  {
    regExp: /start/i,
    handler: sensorHandler.startSendingSensorValueLoop,
  },
  {
    regExp: /stop/i,
    handler: sensorHandler.stopGetSensorValueLoop,
  },
] as WebsocketMessageTypeHandler[]
