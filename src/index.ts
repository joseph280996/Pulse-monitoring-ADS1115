import * as dotenv from 'dotenv'
import Server from 'src/server/application'
import httpController from 'src/server/application/controllers/REST/httpController'
import wsController from 'src/server/application/controllers/WebSocket/wsController'

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
