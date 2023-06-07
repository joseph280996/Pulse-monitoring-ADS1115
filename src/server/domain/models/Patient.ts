import IPatient from '../interfaces/IPatient'
import { PatientDataType } from './Patient.types'

class Patient implements IPatient {
  //#region Properties
  public id?: number | undefined
  public userId?: number
  public firstName?: string
  public lastName?: string
  //#endregion

  //#region Constructor
  constructor(obj: PatientDataType) {
    this.id = obj.id
    this.userId = obj.userId
    this.firstName = obj.firstName
    this.lastName = obj.lastName
  }
  //#endregion
}

export default Patient
