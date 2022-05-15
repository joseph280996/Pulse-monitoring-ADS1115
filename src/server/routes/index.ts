import { RequestHandler } from 'express'
import getHandPositions from './handPositionsHandlers'
import getPulseTypes from './pulseTypesHandlers'
import * as RecordHandler from './recordsHandlers'

export type RouteType = {
  method: string
  route: string
  handler: RequestHandler
}
export default [
  // Get Requests
  {
    method: 'get',
    route: '/pulse-type',
    handler: getPulseTypes,
  },
  {
    method: 'get',
    route: '/hand-position',
    handler: getHandPositions,
  },
  {
    method: 'get',
    route: '/record/:id',
    handler: RecordHandler.getByID,
  },
  // Post Request
  {
    method: 'post',
    route: '/record',
    handler: RecordHandler.createRecord,
  },
  {
    method: 'post',
    route: '/data',
    handler: RecordHandler.exportData,
  },
] as RouteType[]
