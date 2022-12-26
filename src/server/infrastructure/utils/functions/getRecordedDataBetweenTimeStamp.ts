import moment, { Moment } from 'moment'
import { RecordedData } from '../../../application/handlers/webSocket/sensorValueHandler.types'

export default (
  store: RecordedData[][],
  startTimeMoment: Moment,
  endTimeMoment: Moment,
) => {
  const recordedValues: RecordedData[] = []
  store.forEach((row) =>
    row.forEach((value) => {
      const valueTimeStampMoment = moment.utc(value.timeStamp)
      if (
        valueTimeStampMoment.isAfter(startTimeMoment) &&
        valueTimeStampMoment.isBefore(endTimeMoment)
      ) {
        recordedValues.push(value)
      }
    }),
  )
  return recordedValues
}
