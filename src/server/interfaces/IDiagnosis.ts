import { DiagnosisDto } from '../dtos/DiagnosisDto'
import Record from '../models/Record'

export interface IDiagnosis extends DiagnosisDto {
  id?: number
  pulseTypeID?: number
  patientID?: number
  records?: [Record]
}
