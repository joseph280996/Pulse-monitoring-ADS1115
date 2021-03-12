import http from 'http'
import Express from 'express'
import { Server as WebSocketServer } from 'ws'
import { RouteType } from './routes'
import { WebsocketMessageTypeHandler } from './wsMessageTypeHandlers'

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
  }

  registerRoute(routes: RouteType[]) {
    routes.forEach(({ method, route, handler }) => {
      this.app[method](route, handler)
    })
  }

  registerWebsocketMessageTypes(messageTypes: WebsocketMessageTypeHandler[]) {
    this.wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
      console.log(`Connection from ${req.socket.remoteAddress}`)
      ws.on('message', (message: string) => {
        messageTypes.forEach(({ regExp, handler }) => {
          if (regExp.test(message)) {
            handler(message.replace(regExp, ''), ws)
          }
        })
      })
    })
  }

  cleanUp = () => {
    if (this.wss) {
      this.wss.close()
    }
  }
}
export default new Server()
