import RecordInstance from '../models/RecordInstance'

interface ISensorService {
  name: string
  init(): Promise<unknown>
  start(): void
  stop(): void
  pause(): void
  resume(): void
  getSingleBatchData(): RecordInstance[]
}

export default ISensorService
