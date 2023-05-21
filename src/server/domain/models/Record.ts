import { RecordDataType } from './Record.types'

class Record {
  //#region properties
  public id?: number
  public data!: string
  public recordTypeId!: number
  public dateTimeCreated?: string
  public dateTimeUpdated?: string
  //#endregion

  //#region constructor
  constructor(record: RecordDataType) {
    this.id = record.id
    this.data = record.data
    this.recordTypeId = record.recordTypeId
    this.dateTimeCreated = record.dateTimeCreated
    this.dateTimeUpdated = record.dateTimeUpdated
  }
  //#endregion

  //#region public methods
  clone() {
    return new Record(this)
  }
  //#endregion
}

export default Record
