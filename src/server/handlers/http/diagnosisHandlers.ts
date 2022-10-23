import { RequestHandler } from 'express'
import { DiagnosisDto } from 'src/server/dtos/DiagnosisDto'
import Diagnosis from 'src/server/models/Diagnosis'
import FileSystemService from 'src/server/services/FileSystemService'
import DiagnosisRepository from '../../repositories/DiagnosisRepository'
import PatientRepository from '../../repositories/PatientRepository'
import formatInputDateForExport from '../../utils/functions/formatInputDateForExport'
import splitNameForDB from '../../utils/functions/splitNameForDB'

/**
 * #########################
 * # Get Request Handlers #
 * #########################
 */

export const getByID: RequestHandler = async (req, res) => {
  const { id: recordId } = req.params
  const record = await DiagnosisRepository.getByID(Number(recordId))
  if (!record) {
    res.status(400).send('The request record id does not exist')
  }
  res.status(200).send(record)
}

/**
 * #########################
 * # Post Request Handlers #
 * #########################
 */

/**
 * Diagnosis Creation Request Handler
 * Handles creating patient, new diagnosis + update record with new diagnosis id
 *
 * @param req HTTP Request with information to create Diagnosis
 * @param res Express Response object
 */
export const createDiagnosis: RequestHandler = async (req, res) => {
  const { patientName, recordID, pulseTypeID } = req.body
  try {
    const [firstName, lastName] = splitNameForDB(patientName)

    const patient = await PatientRepository.createIfNotExist({
      firstName,
      lastName,
    })

    const newDiagnosis: DiagnosisDto = {
      pulseTypeID,
      patientID: patient?.id as number,
      piezoelectricRecordID: recordID as number,
    }
    const savedDiagnosis = await DiagnosisRepository.create(newDiagnosis)

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
export const exportData: RequestHandler = async (req, res) => {
  try {
    const { startDate, endDate } = req.body
    if (!startDate || !endDate) {
      throw new Error('Time range for export must be provided')
    }
    const diagnoses = await DiagnosisRepository.getByDateRange({
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
