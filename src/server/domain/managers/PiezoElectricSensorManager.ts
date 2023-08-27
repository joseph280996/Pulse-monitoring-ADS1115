/// <reference path="../../../types/ads1115/index.d.ts"/>

/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
import i2c, { PromisifiedBus } from 'i2c-bus'
import ADS1115 from 'ads1115'
import moment from 'moment'
import RecordInstance from '../models/RecordInstance'
import SensorServiceBase from './SensorManagerBase'
import recordTypes from '../../infrastructure/variables/recordTypes'

class PiezoElectricSensorService extends SensorServiceBase {
  //#region Properties
  override get name() {
    return this.SERVICE_NAME
  }

  //#endregion

  //#region Constructor
  constructor(
    private readonly SERVICE_NAME = 'piezoElectricService',
    private bus: PromisifiedBus | null = null,
    private ads1115: typeof ADS1115 = ADS1115,
  ) {
    super()
  }
  //#endregion

  //#region pulic methods
  override async init() {
    this.diagnosis = await this.diagnosisRepo.create({})
    this.recordSession = await this.recordSessionRepo.create({
      diagnosisId: this.diagnosis?.id as number,
      recordTypeId: recordTypes.PIEZO_ELECTRIC_SENSOR_TYPE,
    })
    this.bus = await i2c.openPromisified(1)
    this.ads1115 = await ADS1115(this.bus)
  }
  //#endregion

  //#region Private Methods
  override async readADS1115Value(): Promise<RecordInstance> {
    const data: number = await this.ads1115.measure('0+GND')
    return new RecordInstance(moment.utc().valueOf(), data)
  }
  //#endregion
}

export default PiezoElectricSensorService
