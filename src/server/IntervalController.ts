class IntervalController {
  private static intervals: Map<string, NodeJS.Timeout | null> = new Map()

  static registerInterval(name: string, interval: NodeJS.Timeout): void {
    if (this.intervals.has(name)) {
      console.warn(
        `An interval is registered with the same name detected [${name}]`,
      )
      clearInterval(this.intervals.get(name) as NodeJS.Timeout)
    }
    this.intervals.set(name, interval)
  }

  static clear(name: string): void {
    if (this.intervals.has(name) && this.intervals.get(name)) {
      clearInterval(this.intervals.get(name) as NodeJS.Timeout)
      this.intervals.delete(name)
    }
  }
}

export default IntervalController
