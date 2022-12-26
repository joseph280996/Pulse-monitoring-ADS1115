import { RecordedData } from '../../../application/handlers/webSocket/sensorValueHandler.types'

export default (store: RecordedData[], num: number) => store.slice(-num)
