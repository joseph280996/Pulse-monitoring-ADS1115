/* eslint-disable no-await-in-loop */
import * as http from 'http'
import cors from 'cors'
import Express, { json, urlencoded } from 'express'
import WebSocket, { RawData, Server as WebSocketServer } from 'ws'
import db from '../domain/models/DbConnectionModel'
import DiagnosisController from './controllers/REST/diagnosisController'
import HandPositionsController from './controllers/REST/handPositionsController'
import PulseTypesController from './controllers/REST/pulseTypesController'
import SensorController from './controllers/WebSocket/sensorController'
import PatientController from './controllers/REST/patientController'

interface ServerInterface {
  cleanUp: () => void
}

type ExpressApp = Express.Express & {
  [key: string]: any
}

class Server implements ServerInterface {
  private wss: WebSocketServer

  private app: ExpressApp

  private server: http.Server

  constructor() {
    this.app = Express()
    this.server = http.createServer(this.app)
    this.wss = new WebSocketServer({ server: this.server })
    this.app.use(cors())
    this.app.use(json())
    this.app.use(
      urlencoded({
        extended: true,
      }),
    )
  }

  registerRouter() {
    this.app.use('/diagnosis', (new DiagnosisController()).router)
    this.app.use('/hand-position', (new HandPositionsController()).router)
    this.app.use('/pulse-types', (new PulseTypesController).router)
    this.app.use('/patient', (new PatientController()).router)
  }

  registerWebsocketMessageTypes() {
    this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
      // eslint-disable-next-line no-console
      console.log(`Connection from ${req.socket.remoteAddress} established`)
      ws.on('message', (rawMessage: RawData) => {
        SensorController.instance.router(rawMessage, ws)
      })
    })
  }

  cleanUp = () => {
    if (this.wss) {
      this.wss.close()
    }
    if (db.hasPoolOpened()) {
      db.cleanUp()
    }
  }

  start = (port: number) => {
    this.server.listen(port, () => {
      console.log(`Server started at localhost port ${port}`)
    })
  }
}
export default new Server()
