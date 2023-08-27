import express, { RequestHandler, Router } from 'express'
import Diagnosis from '../../../domain/models/Diagnosis'
import FileSystemService from '../../../infrastructure/services/FileSystemService'
import DiagnosisRepository from '../../../domain/repositories/DiagnosisRepository'
import formatInputDateForExport from '../../../infrastructure/utils/functions/formatInputDateForExport'

/**
 * Diagnosis API Controller
 *
 * A list of all HTTP request handler for diagnosis with top level try-catch clause
 * for appropriate status code return
 */
class DiagnosisController {
  //#region Constructors
  constructor(
    public router: Router = express.Router(),
    private readonly diagnosisRepo = new DiagnosisRepository(),
  ) {
    this.registerRoutes()
  }
  //#endregion

  //#region Public Methods

  /**
   * Get All Diagnoses.
   *
   * Returns all the diagnosis in the system to the front end for display.
   *
   * @returns All Diagnoses.
   */
  getAllDiagnoses: RequestHandler = async (_, res) => {
    const diagnoses = await this.diagnosisRepo.getAll()
    res.status(200).send(diagnoses)
  }

  /**
   * Get Diagnosis By Id.
   *
   * Return the diagnosis with the provided id.
   *
   * @returns Diagnosis with given Id.
   */
  getByIdWithRecord: RequestHandler = async (req, res) => {
    const { id: diagnosisId } = req.params

    const records = await this.diagnosisRepo.getByIdWithRecord(
      Number(diagnosisId),
    )
    if (!records) {
      res.status(400).send('The request diagnosis id does not exist')
    }

    res.status(200).send(records)
  }

  /**
   * Export Data Request Handler
   *
   * Handles exporting data within date range to a JSON file in
   * the file system
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

    this.router.post('/export', this.exportData)
  }
  //#endregion
}

export default DiagnosisController
