import { RequestHandler } from 'express'
import { pick } from 'lodash'
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
  const record = await Record.getByID(Number(recordId))
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
export const createRecord: RequestHandler = async (req, res) => {
  try {
    const [firstName, lastName] = splitNameForDB(req.body.patientName)
    let foundPatient = await Patient.findPatientByName({ firstName, lastName })
    if (!foundPatient) {
      foundPatient = new Patient({ firstName, lastName })
      await foundPatient.save()
    }
    const newRecord = new Record({
      patientID: foundPatient.id as number,
      ...pick(req.body, ['id', 'pulseTypeID', 'handPositionID', 'data']),
    })
    const savedRecord = await newRecord.save()
    res.status(200).send(savedRecord)
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
    const records = await Record.getByDateRange({ startDate, endDate })
    const { formattedStartDate, formattedEndDate } = formatInputDateForExport(
      startDate,
      endDate,
    )
    const pathToDesktop = await createIfNotExistFolder('export-data')
    await writeToFile(
      records,
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
