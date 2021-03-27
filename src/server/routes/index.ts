import { RequestHandler } from 'express'
import HandPosition from '../model/HandPosition'
import PulseTypes from '../model/PulseTypes'
import Record from '../model/Record'

export type RouteType = {
  method: string
  route: string
  handler: RequestHandler
}
export default [
  {
    method: 'get',
    route: '/pulse-type',
    handler: async (_req, res) => {
      const pulseTypes = await PulseTypes.loadAll()
      res.status(200).send(pulseTypes)
    },
  },
  {
    method: 'get',
    route: '/hand-position',
    handler: async (_req, res) => {
      try {
        const handPositions = await HandPosition.loadAll()
        res.status(200).send(handPositions)
      } catch (err) {
        console.error(err)
        console.log(err.stack)
        res.status(500).send('Internal Error')
      }
    },
  },
  {
    method: 'post',
    route: '/record',
    handler: async (req, res) => {
      try {
        const newRecord = new Record(req.body)
        const savedRecord = await newRecord.save()
        res.status(200).send(savedRecord)
      } catch (err) {
        console.error(err)
        console.log(err.stack)
        res.status(500).send('Internal Error')
      }
    },
  },
] as RouteType[]
