import * as dotenv from 'dotenv'
import Server from './server'
import httpController from './server/controllers/httpController'
import wsController from './server/controllers/wsController'

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
