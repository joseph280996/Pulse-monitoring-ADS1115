import RecordInstance from './RecordInstance'

class Record {
  constructor(
    public data: RecordInstance[],
    public recordSessionId: number,
    public id?: number,
    public dateTimeCreated?: string,
    public dateTimeUpdated?: string,
  ) {}
}

export default Record
