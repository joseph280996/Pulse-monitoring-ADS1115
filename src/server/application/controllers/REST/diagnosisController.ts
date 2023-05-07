import express, { RequestHandler, Router } from 'express'
import Diagnosis from '../../../domain/models/Diagnosis'
import FileSystemService from '../../../infrastructure/services/FileSystemService'
import DiagnosisRepository from '../../../domain/repositories/DiagnosisRepository'
import PatientRepository from '../../../domain/repositories/PatientRepository'
import formatInputDateForExport from '../../../infrastructure/utils/functions/formatInputDateForExport'
import splitNameForDB from '../../../infrastructure/utils/functions/splitNameForDB'

class DiagnosisController {
  //#region Properties
  private static _instance: DiagnosisController
  public static get instance() {
    if (!DiagnosisController._instance) {
      DiagnosisController._instance = new DiagnosisController()
    }
    return DiagnosisController._instance
  }
  //#endregion

  //#region Constructors
  constructor(
    public router: Router = express.Router(),
    private readonly diagnosisRepo = DiagnosisRepository.instance,
  ) {
    this.registerRoutes()
  }
  //#endregion

  //#region Public Methods

  /**
   * Get All Diagnoses.
   *
   * @param req HTTP Request with information to create Diagnosis.
   * @param res Express Response object.
   * @returns All Diagnoses.
   */
  getAllDiagnoses: RequestHandler = async (_, res) => {
    const diagnoses = await this.diagnosisRepo.getAll()
    console.log(diagnoses);
    res.status(200).send(diagnoses)
  }

  /**
   * Get Diagnosis By Id.
   *
   * @param req HTTP Request with information to create Diagnosis.
   * @param res Express Response object.
   * @returns Diagnosis with given Id.
   */
  getByIdWithRecord: RequestHandler = async (req, res) => {
    const { id: diagnosisId } = req.params

    const records = await this.diagnosisRepo.getByIdWithRecord(Number(diagnosisId))
    if (!records) {
      res.status(400).send('The request diagnosis id does not exist')
    }

    res.status(200).send(records)
  }

  /**
   * Diagnosis Creation Request Handler
   * Handles creating patient, new diagnosis + update record with new diagnosis id
   *
   * @param req HTTP Request with information to create Diagnosis
   * @param res Express Response object
   */
  createDiagnosis: RequestHandler = async (req, res) => {
    const { patientName, recordID, pulseTypeID } = req.body
    try {
      const [firstName, lastName] = splitNameForDB(patientName)

      const patient = await PatientRepository.createIfNotExist({
        firstName,
        lastName,
      })

      const newDiagnosis = new Diagnosis(
        pulseTypeID,
        patient?.id as number,
        recordID
      )
      const savedDiagnosis = await this.diagnosisRepo.create(newDiagnosis)

      res.status(200).send(savedDiagnosis)
    } catch (err) {
      console.error(err)
      res.status(500).send('Internal Error')
    }
  }

  /**
   * Export Data Request Handler
   * Handles exporting data within date range
   *
   * @param req HTTP Request with information to create Diagnosis
   * @param res Express Response object
   */
  exportData: RequestHandler = async (req, res) => {
    try {
      const { startDate, endDate } = req.body
      if (!startDate || !endDate) {
        throw new Error('Time range for export must be provided')
      }
      const diagnoses = await this.diagnosisRepo.getByDateRange({
        startDate,
        endDate,
      })
      const { formattedStartDate, formattedEndDate } = formatInputDateForExport(
        startDate,
        endDate,
      )
      const fileService = new FileSystemService<Diagnosis[]>(
        `${formattedStartDate}-${formattedEndDate}`,
      )
      await fileService.write(diagnoses, { formatType: 'JSON' })
      res.status(200).send({ status: 200 })
    } catch (err) {
      console.error(err)
      res.status(500).send('Internal Error')
    }
  }

  //#endregion
  //#region Private Methods
  private registerRoutes() {
    this.router.get('/', this.getAllDiagnoses)
    this.router.get('/:id', this.getByIdWithRecord)

    this.router.post('/', this.createDiagnosis)
    this.router.post('/export', this.exportData)
  }
  //#endregion
}

export default DiagnosisController
