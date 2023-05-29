import axios, { Axios } from 'axios'
class EcgSensorService {
    private static _instance: EcgSensorService;

    private static readonly axiosConf = {
        baseUrl: 'http://localhost:8080',
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
            await this.ecgAxiosInstance.post('/diagnosis/notify', { diagnosisId })
        }
        catch (error) {
            console.error("Error notifying ecg service");
        }
    }
}

export default EcgSensorService