import { SENSOR_LOOP_STATUS } from '../types'

class SensorLoopHandler {
  private isStarted: boolean

  constructor() {
    this.isStarted = false
  }

  start() {
    this.isStarted = true
  }

  stop() {
    this.isStarted = false
  }

  status() {
    if (this.isStarted) {
      return SENSOR_LOOP_STATUS.STARTED
    }
    return SENSOR_LOOP_STATUS.STOPPED
  }
}

export default new SensorLoopHandler()
