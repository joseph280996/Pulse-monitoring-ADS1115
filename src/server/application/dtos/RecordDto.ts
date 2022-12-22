import { RecordedData } from '../handlers/webSocket/sensorValueHandler.types'

type RecordDto = {
  id?: number
  data: RecordedData[]
  diagnosisID: number
  dateTimeCreated?: string
  dateTimeUpdated?: string
}

export default RecordDto
