import Record from './Record'

class RecordSession {
  //#region constructor
  constructor(
    public records: Record[],
    public diagnosisId: number,
    public recordTypeId: number,
    public id?: number,
    public dateTimeCreated?: string,
    public dateTimeUpdated?: string,
  ) {
  }
  //#endregion
}

export default RecordSession
