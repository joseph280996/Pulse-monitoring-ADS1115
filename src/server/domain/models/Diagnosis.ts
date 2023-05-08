import Record from './Record'

class Diagnosis {
  public piezoElectricRecords?: Record[]

  //#region constructor
  constructor(
    public patientId?: number,
    public handPositionId?: number,
    public pulseTypeId?: number,
    public id?: number,
    public dateTimeCreated?: string,
    public dateTimeUpdated?: string,
  ) { }
  //#endregion
}

export default Diagnosis
