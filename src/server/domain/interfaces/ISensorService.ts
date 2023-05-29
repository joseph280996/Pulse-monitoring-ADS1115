import Record from "../models/Record"

interface PiezoElectricSensorService {
  name: string
  init(): Promise<unknown>
  start(): void
  stop(): void
  getSingleBatchData(): Record[]
}

export default PiezoElectricSensorService
