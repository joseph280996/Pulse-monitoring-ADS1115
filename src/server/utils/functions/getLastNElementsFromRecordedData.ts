import { RecordedData } from '../../types'

export default (store: RecordedData[], num: number) => store.slice(-num)
