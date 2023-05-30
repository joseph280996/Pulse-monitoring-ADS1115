import RecordInstance from '../models/RecordInstance'

interface PiezoElectricSensorService {
  name: string
  init(): Promise<unknown>
  start(): void
  stop(): void
  getSingleBatchData(): RecordInstance[]
}

export default PiezoElectricSensorService
