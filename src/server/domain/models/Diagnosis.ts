import RecordSession from './RecordSession'

class Diagnosis {
  public piezoElectricRecords?: RecordSession
  public ecgRecords?: RecordSession

  //#region Constructor
  constructor(
    public patientId?: number,
    public handPositionId?: number,
    public pulseTypeId?: number,
    public id?: number,
    public dateTimeCreated?: string,
    public dateTimeUpdated?: string,
  ) {}
  //#endregion
}

export default Diagnosis
