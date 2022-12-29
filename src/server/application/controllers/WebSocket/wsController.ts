/* eslint-disable no-await-in-loop*/
import dotenv from 'dotenv'
import * as sensorHandler from '../../handlers/webSocket/sensorValueHandler'
import { WebsocketMessageTypeHandler } from './wsController.types'

dotenv.config()

export default {
    start: sensorHandler.startSendingSensorValueLoop,
    stop: sensorHandler.stopGetSensorValueLoop,
} as WebsocketMessageTypeHandler
