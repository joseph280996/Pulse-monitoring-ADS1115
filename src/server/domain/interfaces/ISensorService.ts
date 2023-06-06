import RecordInstance from '../models/RecordInstance'

interface IPiezoElectricSensorService {
  name: string
  init(): Promise<unknown>
  start(): void
  stop(): void
  getSingleBatchData(): RecordInstance[]
}

export default IPiezoElectricSensorService
