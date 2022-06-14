import { DiagnosisDataType } from '../models/Diagnosis.types'
import Record from '../models/Record'

export interface IDiagnosis extends DiagnosisDataType {
  id?: number
  pulseTypeID?: number
  patientID?: number
  records?: [Record]
}
