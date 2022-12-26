import { DiagnosisDto } from 'src/server/application/dtos/DiagnosisDto'
import RecordRepository from '../repositories/RecordRepository'
import Record from './Record'

class Diagnosis {
  //#region properties
  public id?: number
  public pulseTypeID?: number
  public patientID?: number
  public dateTimeCreated?: string
  public dateTimeUpdated?: string
  private recordRepo!: RecordRepository
  //#endregion

  //#region constructor
  constructor(obj: DiagnosisDto) {
    this.id = obj.id
    this.pulseTypeID = obj.pulseTypeID
    this.patientID = obj.patientID
    this.dateTimeCreated = obj.dateTimeCreated
    this.dateTimeUpdated = obj.dateTimeUpdated
    this.recordRepo = RecordRepository.instance
  }
  //#endregion

  //#region getters
  get piezoelectricRecords(): Promise<Array<Record>> {
    if (!this.id) {
      throw new Error('Diagnosis has not been initialized')
    }
    return this.recordRepo.getByDiagnosisID(this.id)
  }
  //#endregion
}

export default Diagnosis
