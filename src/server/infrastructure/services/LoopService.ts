import ILoopService from '../interfaces/ILoopService'
import { SENSOR_LOOP_STATUS } from './LoopService.types'

class SensorLoopService implements ILoopService {
  //#region Properties
  private started: boolean
  get isStarted() {
    return this.started
  }
  //#endregion

  //#region Constructor
  constructor() {
    this.started = false
  }
  //#endregion

  //#region Public Methods
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
  //#endregion
}

export default SensorLoopService
