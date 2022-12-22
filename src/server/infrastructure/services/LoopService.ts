import ILoopService from '../interfaces/ILoopService'
import { SENSOR_LOOP_STATUS } from './LoopService.types'

class SensorLoopService implements ILoopService {
  private started: boolean

  constructor() {
    this.started = false
  }

  start() {
    this.started = true
  }

  stop() {
    this.started = false
  }

  status() {
    if (this.started) {
      return SENSOR_LOOP_STATUS.STARTED
    }
    return SENSOR_LOOP_STATUS.STOPPED
  }

  get isStarted() {
    return this.started
  }
}

export default SensorLoopService
