import ILoopService from '../interfaces/ILoopService'
import { SENSOR_LOOP_STATUS } from './LoopService.types'

  /**
   * Service to control the infinite loop flag
   *
   * This class will encapsulate the infinite loop
   * status flag
   */
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

  /**
   * Set the status to true for infinite loop
  */
  start() {
    this.started = true
  }

  /**
   * Set the status to false for infinite loop
  */
  stop() {
    this.started = false
  }

  /**
   * Get the current status of the loop
   *
   * @returns A boolean that indicate state of the flag 
  */
  status() {
    if (this.started) {
      return SENSOR_LOOP_STATUS.STARTED
    }
    return SENSOR_LOOP_STATUS.STOPPED
  }
  //#endregion
}

export default SensorLoopService
