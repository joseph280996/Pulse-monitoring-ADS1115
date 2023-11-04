class TimeIntervalService {
  private static _instance: TimeIntervalService
  static get instance(): TimeIntervalService {
    if (!this._instance) {
      this._instance = new TimeIntervalService()
    }

    return this._instance
  }

  private constructor() {}

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
