import Singleton from '../utils/classes/Singleton'

class TimeIntervalService extends Singleton {
  //#region Properties
  private intervals: Map<string, NodeJS.Timeout | null> = new Map()

  //#region Public Methods
  registerInterval(name: string, interval: NodeJS.Timeout): void {
    if (this.intervals.has(name)) {
      console.warn(
        `An interval is registered with the same name detected [${name}]`,
      )
      clearInterval(this.intervals.get(name) as NodeJS.Timeout)
    }
    this.intervals.set(name, interval)
  }

  clear(name: string): void {
    if (this.intervals.has(name) && this.intervals.get(name)) {
      clearInterval(this.intervals.get(name) as NodeJS.Timeout)
      this.intervals.delete(name)
    }
  }
  //#endregion
}

export default TimeIntervalService
