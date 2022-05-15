import { RecordedData } from '..'
import { RecordFieldsType } from '../../models/Record.types'
import IModel from './IModel'

export interface IRecord extends IModel<RecordFieldsType> {
  id?: number
  pulseTypeID?: number
  handPositionID: number
  data: RecordedData[]
  patientID?: number
}

export default IRecord
