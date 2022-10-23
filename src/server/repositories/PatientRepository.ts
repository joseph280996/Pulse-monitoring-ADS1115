import { PatientDto } from '../dtos/PatientDto'
import IRepository from '../interfaces/IRepository'
import DBInstance, { DB } from '../models/DbConnectionModel'
import Patient from '../models/Patient'
import { PatientDataType, PatientNameType } from '../models/Patient.types'
import * as PatientSqls from '../sqls/patientSqls'

class PatientRepository implements IRepository<PatientDto, Patient | null> {
  db!: DB

  constructor(db = DBInstance) {
    this.db = db
  }

  async create(patient: PatientDto) {
    try {
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

  async update(_: PatientDto): Promise<boolean> {
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

  async createIfNotExist({
    firstName,
    lastName,
  }: PatientNameType): Promise<Patient> {
    let foundPatient = await this.findPatientByName({
      firstName,
      lastName,
    })

    if (!foundPatient) {
      foundPatient = await this.create(new Patient({ firstName, lastName }))
    }

    return foundPatient as Patient
  }
}

export default new PatientRepository()
