import { DiagnosisDataType } from './Diagnosis.types'

class Diagnosis {
  public id?: number

  public pulseTypeID?: number

  public patientID?: number

  public piezoelectricRecordID!: number

  public dateTimeCreated?: string

  public dateTimeUpdated?: string

  constructor(obj: DiagnosisDataType) {
    this.id = obj.id
    this.pulseTypeID = obj.pulseTypeID
    this.patientID = obj.patientID
    this.piezoelectricRecordID = obj.piezoelectricRecordID
    this.dateTimeCreated = obj.dateTimeCreated
    this.dateTimeUpdated = obj.dateTimeUpdated
  }
}

export default Diagnosis
