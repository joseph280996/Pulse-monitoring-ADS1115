import RecordInstance from 'src/server/domain/models/RecordInstance'

export default (store: RecordInstance[], num: number) => store.slice(-num)
