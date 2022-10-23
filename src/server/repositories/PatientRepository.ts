import IRepository from '../interface/IRepository'
import DBInstance, { DB } from '../models/DbConnectionModel'
import Patient from '../models/Patient'
import { PatientDataType, PatientNameType } from '../models/Patient.types'
import * as PatientSqls from '../sqls/patientSqls'

class PatientRepository implements IRepository<Patient, Patient | null> {
  db!: DB

  constructor(db = DBInstance) {
    this.db = db
  }

  async create(patient: Patient) {
    try {
      console.log(patient.firstName)
      console.log(patient.lastName)
      const result = await this.db.query<
        { insertedId: number },
        [Array<string | undefined>]
      >(PatientSqls.CREATE_PATIENT, [[patient.firstName, patient.lastName]])
      return new Patient({
        ...patient,
        id: result.insertedId,
      })
    } catch (error) {
      return null
    }
  }

  async update(_: Patient): Promise<boolean> {
    throw new Error(`Method not implemented`)
  }

  async getAll(): Promise<Patient[]> {
    const result = await this.db.query<PatientDataType[], void>(
      PatientSqls.GET_ALL,
    )
    return result && result.length > 0
      ? result.map((row: PatientDataType) => new Patient(row))
      : []
  }

  async getByID(id: number) {
    const result = await this.db.query<PatientDataType, number[]>(
      PatientSqls.GET_BY_ID,
      [id],
    )
    return result ? new Patient(result) : null
  }

  async findPatientByName({
    firstName,
    lastName,
  }: PatientNameType): Promise<Patient | null> {
    const results = await this.db.query<PatientDataType[], string[]>(
      PatientSqls.GET_BY_FIRST_LAST_NAME,
      [firstName, lastName],
    )
    return results && results.length ? new Patient(results[0]) : null
  }
}

export default new PatientRepository()
