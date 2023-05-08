import { DiagnosisDto } from '../dtos/DiagnosisDto'
import Record from '../models/Record'

export interface Idiagnosis extends DiagnosisDto {
  id?: number
  pulseTypeId?: number
  patientId?: number
  records?: [Record]
}
