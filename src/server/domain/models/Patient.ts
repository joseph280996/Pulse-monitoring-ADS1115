import IPatient from '../interfaces/IPatient'
import { PatientDataType } from './Patient.types'

class Patient implements IPatient {
  public id?: number | undefined

  public userID?: number

  public firstName?: string

  public lastName?: string

  constructor(obj: PatientDataType) {
    this.id = obj.id
    this.userID = obj.userID
    this.firstName = obj.firstName
    this.lastName = obj.lastName
  }
}

export default Patient
