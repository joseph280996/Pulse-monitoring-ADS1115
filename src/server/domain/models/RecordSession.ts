import RecordInstance from './RecordInstance'

class RecordSession {
  public records?: RecordInstance[]

  //#region Constructor
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
