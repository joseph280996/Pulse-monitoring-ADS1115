import { RecordDataType } from './Record.types'

class Record {
  public id?: number

  public data!: string

  public typeID!: number

  public dateTimeCreated?: string

  public dateTimeUpdated?: string

  constructor(record: RecordDataType) {
    this.id = record.id
    this.typeID = record.typeID
    this.data = record.data
    this.dateTimeCreated = record.dateTimeCreated
    this.dateTimeUpdated = record.dateTimeUpdated
  }
  clone() {
    return new Record(this)
  }
}

export default Record
