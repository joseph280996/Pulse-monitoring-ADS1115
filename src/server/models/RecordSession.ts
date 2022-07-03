import Record from './Record'
import { RecordSessionDataType } from './RecordSession.types'

class RecordSession {
  public id!: number

  public piezoelectricRecordID!: number

  public handPositionID!: number

  public dateTimeCreated?: string

  public dateTimeUpdated?: string

  public piezoelectricRecord?: Record

  constructor(session: RecordSessionDataType) {
    this.id = session.id
    this.piezoelectricRecordID = session.piezoelectricRecordID
    this.handPositionID = session.handPositionID
    this.dateTimeCreated = session.dateTimeCreated
    this.dateTimeUpdated = session.dateTimeUpdated
  }

  // public async records(): Promise<void> {
  //   if (!this.id) {
  //     throw new Error(
  //       `Cannot get Record for unsaved Diagnosis - pulseTypeID [${this.pulseTypeID}], patientID [${this.patientID}]`,
  //     )
  //   }
  //   this.piezoelectricRecord = await RecordRepository.getByDiagnosisIDAndType(
  //     this.id,
  //     RECORD_TYPE.PIEZOELECTRIC_SENSOR,
  //   )
  // }
}

export default RecordSession
