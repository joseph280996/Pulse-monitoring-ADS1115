class TimeIntervalService {
  private intervals: Map<string, NodeJS.Timeout | null> = new Map()

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
}

export default new TimeIntervalService()
