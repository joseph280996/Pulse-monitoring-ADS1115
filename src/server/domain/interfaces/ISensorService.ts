import RecordInstance from '../models/RecordInstance'

interface ISensorService {
  diagnosisId: number
  name: string
  init(): Promise<void>
  start(): void
  stop(): void
  pause(): void
  resume(): void
  getSingleBatchData(): RecordInstance[]
}

export default ISensorService
