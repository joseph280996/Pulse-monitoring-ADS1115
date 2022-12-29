/* eslint-disable no-await-in-loop */
import * as http from 'http'
import cors from 'cors'
import Express, { json, urlencoded } from 'express'
import WebSocket, { RawData, Server as WebSocketServer } from 'ws'
import db from '../domain/models/DbConnectionModel'
import { RouteType } from './controllers/REST/httpController.types'
import { WebsocketMessageTypeHandler } from './controllers/WebSocket/wsController.types'

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

  registerRoutes(routes: RouteType[]) {
    routes.forEach(({ method, route, handler, validator }) => {
      if (validator) {
        this.app.use(route, validator)
      }
      this.app[method](route, handler)
    })
  }

  registerWebsocketMessageTypes(messageTypes: WebsocketMessageTypeHandler) {
    this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
      // eslint-disable-next-line no-console
      console.log(`Connection from ${req.socket.remoteAddress} established`)
      ws.on('message', (rawMessage: RawData) => {
        const message = rawMessage.toString()
        const [operation, data] = message.split(';')
        console.log(`Received command to [${operation}] with data [${data}]`)
        const handler = messageTypes[operation]
        handler(data, ws)
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
