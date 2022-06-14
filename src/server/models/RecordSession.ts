import Record from './Record'
import { RecordSessionDataType } from './RecordSession.types'

class RecordSession {
  public id!: number

  public piezoelectricRecordID?: number

  public ecgRecordID?: number

  public handPositionID!: number

  public dateTimeCreated!: string

  public dateTimeUpdated!: string

  public piezoelectricRecord?: Record

  public ecgRecord?: Record

  constructor(session: RecordSessionDataType) {
    this.id = session.id
    this.piezoelectricRecordID = session.piezoelectricRecordID
    this.ecgRecordID = session.ecgRecordID
    this.handPositionID = session.handPositionID
    this.dateTimeCreated = session.dateTimeCreated
    this.dateTimeUpdated = session.dateTimeUpdated
  }

  public async records(): Promise<void> {
    if (!this.id) {
      throw new Error(
        `Cannot get Record for unsaved Diagnosis - pulseTypeID [${this.pulseTypeID}], patientID [${this.patientID}]`,
      )
    }
    this.piezoelectricRecord = await RecordRepository.getByDiagnosisIDAndType(
      this.id,
      RECORD_TYPE.PIEZOELECTRIC_SENSOR,
    )
    this.ecgRecord = await RecordRepository.getByDiagnosisIDAndType(
      this.id,
      RECORD_TYPE.ECG_SENSOR,
    )
  }
}

export default RecordSession
