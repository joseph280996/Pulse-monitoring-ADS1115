import dotenv from 'dotenv'
import Server from './server'
import routes from './server/routes'

dotenv.config()

Server.registerRoutes(routes)
Server.registerWebsocketMessageTypes()
Server.start(8000)

process.on('beforeExit', () => {
  Server.cleanUp()
})

process.on('SIGINT', () => {
  process.exit(2)
})
