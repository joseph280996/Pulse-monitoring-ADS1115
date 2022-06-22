import { RequestHandler } from 'express'
import * as DiagnosisHandler from './diagnosisHandlers'
import getHandPositions from './handPositionsHandlers'
import getPulseTypes from './pulseTypesHandlers'
import * as RecordHandlers from './recordHandlers'

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
    handler: RecordHandlers.getByID,
  },
  // Post Request
  {
    method: 'post',
    route: '/diagnosis',
    handler: DiagnosisHandler.createDiagnosis,
  },
  {
    method: 'post',
    route: '/record',
    handler: RecordHandlers.createEcgRecord,
  },
  {
    method: 'post',
    route: '/data',
    handler: DiagnosisHandler.exportData,
  },
] as RouteType[]
