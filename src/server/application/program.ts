import * as dotenv from 'dotenv'
import Server from './server'

dotenv.config()

Server.registerRouter()
Server.registerWebsocketMessageTypes()
Server.start(8000)

process.on('beforeExit', () => {
  Server.cleanUp()
})

process.on('SIGINT', () => {
  process.exit(2)
})
