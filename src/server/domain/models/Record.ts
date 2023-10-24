import RecordInstance from './RecordInstance'

class Record {
  constructor(
    public data: RecordInstance[],
    public recordTypeId: number,
    public id?: number,
    public dateTimeCreated?: string,
    public dateTimeUpdated?: string,
  ) {}
}

export default Record
