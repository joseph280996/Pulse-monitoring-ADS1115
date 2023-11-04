import express, { RequestHandler, Router } from 'express'
import DiagnosisRepository from '../../../domain/repositories/DiagnosisRepository'
import PatientRepository from '../../../domain/repositories/PatientRepository'
import splitNameForDB from '../../../infrastructure/utils/functions/splitNameForDB'

/**
 * Patient API controller
 *
 * List of all the HTTP requests that will be accepted by the endpoint
 * with a top level try-catch clause for appropriate status code update
 * and error handler
 */
class PatientController {
  //#region Private Properties
  private static _instance: PatientController
  public static get instance() {
    if (!PatientController._instance) {
      PatientController._instance = new PatientController()
    }
    return PatientController._instance
  }

  //#endregion
  //#region Constructors
  private constructor(
    public router: Router = express.Router(),
    private readonly diagnosisRepo = new DiagnosisRepository(),
    private readonly patientRepo = new PatientRepository(),
  ) {
    this.registerRoutes()
  }
  //#endregion

  //#region Public Methods

  /**
   * Diagnosis Creation Request Handler
   * Handles creating patient, and update existing diagnosis
   *
   * @param req HTTP Request with information to create Diagnosis
   * @param res Express Response object
   */
  createPatientForDiagnosis: RequestHandler = async (req, res) => {
    const { patientName, diagnosisId, pulseTypeId } = req.body
    try {
      const [firstName, lastName] = splitNameForDB(patientName)

      const patient = await this.patientRepo.createIfNotExist({
        firstName,
        lastName,
      })

      const existingDiagnosis = await this.diagnosisRepo.getById(diagnosisId)

      if (existingDiagnosis) {
        existingDiagnosis.pulseTypeId = pulseTypeId
        existingDiagnosis.patientId = patient.id

        const savedDiagnosis = await this.diagnosisRepo.update(
          existingDiagnosis,
        )

        res.status(200).send(savedDiagnosis)
      } else {
        res.status(400).send("Can't find diagnosis with the given Id")
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Internal Error')
    }
  }
  //#endregion

  //#region Private Methods
  private registerRoutes() {
    // this.router.get('/', this.getAllPatients)

    this.router.post('/', this.createPatientForDiagnosis)
  }
  //#endregion
}

export default PatientController
