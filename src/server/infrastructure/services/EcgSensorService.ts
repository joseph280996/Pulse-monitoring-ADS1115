import axios, { Axios, CreateAxiosDefaults } from 'axios'
import Singleton from '../utils/classes/Singleton'

class EcgSensorService extends Singleton {
  private static readonly axiosConf: CreateAxiosDefaults<any> = {
    baseURL: 'http://localhost:8080/',
    timeout: 1000,
  }

  constructor(
    private ecgAxiosInstance: Axios = axios.create(EcgSensorService.axiosConf),
  ) {
    super()
  }

  public async notifyDiagnosisCreated(diagnosisId: number) {
    try {
      console.log(`Notifying ECG service with DiagnosisId [${diagnosisId}]`)
      this.ecgAxiosInstance
        .post('diagnosis/notify', { diagnosisId })
        .then((result) => {
          console.log(result)
        })
        .catch((error) => {
          throw error
        })
    } catch (error) {
      console.error('Error notifying ecg service')
      throw error
    }
  }
}

export default EcgSensorService
