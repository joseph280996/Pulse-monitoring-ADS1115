import recordTypes from '../../infrastructure/variables/recordTypes'
import EcgSensorService from '../../infrastructure/services/EcgSensorService'
import IRepository from '../interfaces/IRepository'
import DBInstance, { DB } from '../../infrastructure/services/DbService'
import Diagnosis from '../models/Diagnosis'
import { GetDiagnosisByRangeInputType } from '../models/Diagnosis.types'
import * as DiagnosisSqls from '../sqls/diagnosisSqls'
import RecordRepository from './RecordRepository'

class DiagnosisRepository implements IRepository<Diagnosis, Diagnosis | null> {
  //#region Constructor
  constructor(
    private db: DB = DBInstance,
    private ecgSensorService: EcgSensorService = EcgSensorService.instance as EcgSensorService,
    private recordRepository: RecordRepository = new RecordRepository(),
  ) {}
  //#endregion

  //#region Public Methods
  async create(diagnosis: Diagnosis) {
    try {
      const result = await this.db.query<
        { insertId: number },
        [Array<number | undefined>]
      >(DiagnosisSqls.CREATE_DIAGNOSIS, [
        [diagnosis.pulseTypeId, diagnosis.patientId],
      ])

      if (!result.insertId) {
        return null
      }

      diagnosis.id = result.insertId

      // We may don't have to notify but instead once finished, since we only have 1 
      // doctor use this at a time, we can just find those that do not have diagnosis and
      // assign the diagnosis for those record
      try{
        await this.ecgSensorService.notifyDiagnosisCreated(diagnosis.id as number)
      } catch(error) {
        console.log("Failed to notify ecg service of new diagnosis created")
      }

      return diagnosis
    } catch (error) {
      throw new Error(`Error Creating Diagnosis: ${(error as Error).message}`)
    }
  }

  async update(updateDiagnosis: Diagnosis) {
    const result = await this.db.query<
      { affectedRows: number },
      [Diagnosis, number]
    >(DiagnosisSqls.UPDATE_DIAGNOSIS, [
      updateDiagnosis,
      updateDiagnosis.id || 0,
    ])
    return !!result && result.affectedRows > 0
  }

  async getAll(): Promise<Diagnosis[]> {
    const res: Diagnosis[] = await this.db.query<Diagnosis[], []>(
      DiagnosisSqls.GET_ALL,
      [],
    )

    if (!res || res.length == 0) {
      return []
    }

    return res
  }

  public async getByIdWithNoRecord(id: number) {
    return this.getById(id, false)
  }

  public async getById(id: number, shouldPopulateRecords = true) {
    const res = await this.db.query<Diagnosis[], [number]>(
      DiagnosisSqls.GET_BY_ID,
      [id],
    )

    if (!res || res.length == 0) {
      return null
    }

    const diagnosis = res[0]

    if (shouldPopulateRecords) {
      const records = await this.recordRepository.getByDiagnosisId(
        diagnosis.id as number,
      )
      diagnosis.piezoElectricRecords = records.filter(
        (record) =>
          record.recordTypeId == recordTypes.PIEZO_ELECTRIC_SENSOR_TYPE,
      )
      diagnosis.ecgRecords = records.filter(
        (record) => record.recordTypeId == recordTypes.ECG_SENSOR_TYPE,
      )
    }

    return diagnosis
  }

  async getByDateRange({
    startDate,
    endDate,
  }: GetDiagnosisByRangeInputType): Promise<Diagnosis[]> {
    const res = await this.db.query<Diagnosis[], string[]>(
      DiagnosisSqls.GET_BY_DATE_RANGE,
      [startDate, endDate],
    )

    if (!res || res.length == 0) {
      return []
    }

    return res
  }
  //#endregion
}
export default DiagnosisRepository
