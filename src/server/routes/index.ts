import { Handler } from 'express'
import db from '../db'

export type RouteType = {
  method: string
  route: string
  handler: Handler
}
export default [
  {
    method: 'get',
    route: '/pulse-type',
    handler: (_, response) => {},
  },
] as RouteType[]

export type WebsocketMessageTypeType = {}
