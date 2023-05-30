import Record from './Record'

class RecordSession {
  public records?: Record[]

  //#region constructor
  constructor(
    public diagnosisId: number,
    public recordTypeId: number,
    public id?: number,
    public dateTimeCreated?: string,
    public dateTimeUpdated?: string,
  ) {}
  //#endregion
}

export default RecordSession
