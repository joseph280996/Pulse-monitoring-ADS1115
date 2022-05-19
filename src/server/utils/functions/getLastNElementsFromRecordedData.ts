import moment from 'moment'
import { RecordedData } from '../../types'

export default (store: RecordedData[]) => {
  if (process.env.NODE_ENV === 'development') {
    return Array.from({ length: 20 }, () => ({
      timeStamp: moment.utc(),
      data: Math.random(),
    }))
  }
  return store.slice(-20)
}
