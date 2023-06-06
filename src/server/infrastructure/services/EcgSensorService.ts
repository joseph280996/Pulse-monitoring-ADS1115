import axios, { Axios, CreateAxiosDefaults } from 'axios'


class EcgSensorService {
    private static _instance: EcgSensorService;

    private static readonly axiosConf: CreateAxiosDefaults<any> = {
        baseURL: 'http://localhost:8080/',
        timeout: 1000,
    }

    public static get instance() {
        if (!EcgSensorService._instance) {
            EcgSensorService._instance = new EcgSensorService();
        }
        return EcgSensorService._instance;
    }

    constructor(
        private ecgAxiosInstance: Axios = axios.create(EcgSensorService.axiosConf)) { }

    public async notifyDiagnosisCreated(diagnosisId: number) {
        try {
            console.log(`Notifying ECG service with DiagnosisId [${diagnosisId}]`)
            this.ecgAxiosInstance.post('diagnosis/notify', { diagnosisId }).then((result)=> {
                console.log(result)
            }).catch((error)=> {
                throw error
            })
        }
        catch (error) {
            console.error("Error notifying ecg service");
            throw error;
        }
    }
}

export default EcgSensorService