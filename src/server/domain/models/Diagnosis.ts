import Record from "./Record";

class Diagnosis {
  public piezoElectricRecords?: Record[]
  public ecgRecords?: Record[]

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
