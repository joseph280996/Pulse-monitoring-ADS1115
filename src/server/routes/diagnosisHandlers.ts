import { RequestHandler } from 'express'
import { pick } from 'lodash'
import Diagnosis from '../models/Diagnosis'
import Patient from '../models/Patient'
import Record from '../models/Record'
import createIfNotExistFolder from '../utils/functions/createIfNotExistFolder'
import formatInputDateForExport from '../utils/functions/formatInputDateForExport'
import splitNameForDB from '../utils/functions/splitNameForDB'
import writeToFile from '../utils/functions/writeToFile'

/**
 * #########################
 * # Get Request Handlers #
 * #########################
 */

export const getByID: RequestHandler = async (req, res) => {
  const { id: recordId } = req.params
  const record = await Diagnosis.getByID(Number(recordId))
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
  try {
    const [firstName, lastName] = splitNameForDB(req.body.patientName)

    let foundPatient = await Patient.findPatientByName({ firstName, lastName })
    if (!foundPatient) {
      foundPatient = new Patient({ firstName, lastName })
      await foundPatient.save()
    }

    const newDiagnosis = new Diagnosis({
      patientID: foundPatient.id as number,
      ...pick(req.body, ['id', 'pulseTypeID']),
    })
    const savedDiagnosis = await newDiagnosis.save()

    const { recordID } = req.body
    const record = await Record.getByID(recordID)
    if (!record) {
      throw new Error(`Cannot find Record with ID [${recordID}]`)
    }
    record.diagnosisID = newDiagnosis.id
    await record.updateDiagnosisID()

    res.status(200).send(savedDiagnosis)
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Error')
  }
}

export const exportData: RequestHandler = async (req, res) => {
  try {
    const { startDate, endDate } = req.body
    if (!startDate || !endDate) {
      throw new Error('Time range for export must be provided')
    }
    const diagnoses = await Diagnosis.getByDateRange({ startDate, endDate })
    await Promise.all(diagnoses.map((diagnosis) => diagnosis.getRecords()))

    const { formattedStartDate, formattedEndDate } = formatInputDateForExport(
      startDate,
      endDate,
    )
    const pathToDesktop = await createIfNotExistFolder('export-data')
    await writeToFile(
      diagnoses,
      pathToDesktop,
      `${formattedStartDate}-${formattedEndDate}`,
      { formatType: 'CSV' },
    )
    res.status(200).send({ status: 200 })
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Error')
  }
}
