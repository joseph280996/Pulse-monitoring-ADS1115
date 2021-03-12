/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
// <reference path="@types/index.d.ts"/>
import http from 'http'
import ADS1115 from 'ads1115'
import Express from 'express'
import i2c from 'i2c-bus'

import moment, { Moment } from 'moment'
import { Server } from 'ws'

const app = Express()

const server = http.createServer(app)

const wss = new Server({ server })

type StoreType = {
  timeStamp: Moment
  data: number
}

wss.on('connection', (ws: WebSocket) => {
  console.log('connected')
  let store: StoreType[] = []
  setInterval(() => {
    ws.send(JSON.stringify({ recordedData: store }))
    store = []
  }, 200)
  i2c.openPromisified(1).then(async (bus) => {
    const ads1115 = ADS1115(bus)
    while (true) {
      store.push({
        timeStamp: moment.utc(),
        data: await ads1115.measure('0+GND'),
      })
    }
  })
})

server.listen(8000, () => {
  console.log('server ready')
})
