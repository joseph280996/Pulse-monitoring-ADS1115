/// <reference path="../../../types/ads1115/index.d.ts"/>

/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-unresolved
import i2c, { PromisifiedBus } from 'i2c-bus'
import ADS1115 from 'ads1115'
import moment from 'moment'
import RecordInstance from '../models/RecordInstance'
import SensorServiceBase from './SensorManagerBase'

class PiezoElectricSensorService extends SensorServiceBase {
  //#region Constructor
  constructor(
    protected readonly SERVICE_NAME = 'PiezoElectricService',
    private bus: PromisifiedBus | null = null,
    private ads1115: typeof ADS1115 = ADS1115,
  ) {
    super(SERVICE_NAME)
  }
  //#endregion

  //#region pulic methods
  override async init() {
    if (!this.ads1115 && !this.bus) {
      this.bus = await i2c.openPromisified(1)
      this.ads1115 = await ADS1115(this.bus)
    }

    this.diagnosis = await this.diagnosisRepo.create({})
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
