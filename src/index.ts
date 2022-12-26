import * as dotenv from 'dotenv'
import Server from './server/application'
import httpController from './server/application/controllers/REST/httpController'
import wsController from './server/application/controllers/WebSocket/wsController'

dotenv.config()

Server.registerRoutes(httpController)
Server.registerWebsocketMessageTypes(wsController)
Server.start(8000)

process.on('beforeExit', () => {
  Server.cleanUp()
})

process.on('SIGINT', () => {
  process.exit(2)
})
