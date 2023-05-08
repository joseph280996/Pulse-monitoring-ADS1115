import IPatient from '../interfaces/IPatient'
import { PatientDataType } from './Patient.types'

class Patient implements IPatient {
  //#region properties
  public id?: number | undefined
  public userId?: number
  public firstName?: string
  public lastName?: string
  //#endregion

  //#region constructor
  constructor(obj: PatientDataType) {
    this.id = obj.id
    this.userId = obj.userId
    this.firstName = obj.firstName
    this.lastName = obj.lastName
  }
  //#endregion
}

export default Patient
