import db from '../db'
import * as PatientSqls from '../sqls/patientSqls'
import IPatient from '../types/interface/IPatient'

type PatientInputType = {
  id?: number
  userID?: number
  firstName?: string
  lastName?: string
}

type PatientNameType = {
  firstName: string
  lastName: string
}
class Patient implements IPatient {
  public id?: number | undefined

  public userID?: number

  public firstName?: string

  public lastName?: string

  constructor(obj: PatientInputType) {
    this.id = obj.id
    this.userID = obj.userID
    this.firstName = obj.firstName
    this.lastName = obj.lastName
  }

  async save(): Promise<boolean> {
    const result = await db.query(PatientSqls.CREATE_PATIENT, [
      [this.firstName, this.lastName],
    ])
    this.id = result.insertId
    return !!result.insertId
  }

  static async getAll(): Promise<Patient[]> {
    const result = await db.query(PatientSqls.GET_ALL)
    return result && result.length > 0
      ? result.map((row: any) => new Patient(row))
      : []
  }

  static async getById(id: number): Promise<Patient | null> {
    const result = await db.query(PatientSqls.GET_BY_ID, [id])
    return result ? new Patient(result) : null
  }

  static async findPatientByName({
    firstName,
    lastName,
  }: PatientNameType): Promise<Patient | null> {
    const results = await db.query(PatientSqls.GET_BY_FIRST_LAST_NAME, [
      firstName,
      lastName,
    ])
    return results && results.length ? new Patient(results[0]) : null
  }
}

export default Patient
