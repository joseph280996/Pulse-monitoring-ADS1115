import moment from 'moment'
import { RecordedData } from '../../types'

export default (store: RecordedData[][]) => {
  if (process.env.NODE_ENV === 'development')
    return Array.from({ length: 20 }, () => ({
      timeStamp: moment.utc(),
      data: Math.random(),
    }))

  const lastStoreArray = store[store.length - 1]
  if (lastStoreArray.length < 20) {
    return [
      ...store[store.length - 2].slice(20 - lastStoreArray.length),
      ...lastStoreArray,
    ]
  }
  return store[store.length - 1].slice(-20)
}
