import { DiagnosisDto } from '../dtos/DiagnosisDto'
import RecordRepository from '../repositories/RecordRepository'
import Record from './Record'

class Diagnosis {
  public id?: number

  public pulseTypeID?: number

  public patientID?: number

  private piezoelectricRecordID!: number

  public dateTimeCreated?: string

  public dateTimeUpdated?: string

  constructor(obj: DiagnosisDto) {
    this.id = obj.id
    this.pulseTypeID = obj.pulseTypeID
    this.patientID = obj.patientID
    this.piezoelectricRecordID = obj.piezoelectricRecordID
    this.dateTimeCreated = obj.dateTimeCreated
    this.dateTimeUpdated = obj.dateTimeUpdated
  }

  get piezoelectricRecord(): Promise<Record> {
    return RecordRepository.getByID(this.piezoelectricRecordID)
  }
}

export default Diagnosis
