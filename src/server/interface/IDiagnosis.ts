import { DiagnosisFieldsType } from '../models/Diagnosis.types'
import Record from '../models/Record'
import IModel from './IModel'

export interface IDiagnosis extends IModel<DiagnosisFieldsType> {
  id?: number
  pulseTypeID?: number
  patientID?: number
  records?: [Record]
  getRecords: () => Promise<[Record]>
}
