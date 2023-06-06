import RecordInstance from '../models/RecordInstance'

interface ISensorService {
  name: string
  diagnosisId: number
  init(): Promise<unknown>
  start(): void
  stop(): void
  pause(): void
  resume(): void
  getSingleBatchData(): RecordInstance[]
}

export default ISensorService
