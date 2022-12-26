import { RecordedData } from '../../application/handlers/webSocket/sensorValueHandler.types'

interface PiezoElectricSensorService {
  name: string
  init(): Promise<unknown>
  start(): void
  stop(): void
  getSingleBatchData(): RecordedData[]
}

export default PiezoElectricSensorService
