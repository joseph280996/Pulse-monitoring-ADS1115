import { DiagnosisDto } from '../dtos/DiagnosisDto'
import RecordSession from '../models/RecordSession'

export interface Idiagnosis extends DiagnosisDto {
  id?: number
  pulseTypeId?: number
  patientId?: number
  records?: [RecordSession]
}
