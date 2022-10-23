import { RecordedData } from '../handlers/webSocket/sensorValueHandler.types'

type RecordDto = {
  id?: number
  handPositionID: number
  data: RecordedData[]
  dateTimeCreated?: string
  dateTimeUpdated?: string
}

export default RecordDto
