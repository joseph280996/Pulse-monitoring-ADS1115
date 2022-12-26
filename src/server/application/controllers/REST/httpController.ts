import * as DiagnosisHandler from '../../handlers/http/diagnosisHandlers'
import getHandPositions from '../../handlers/http/handPositionsHandlers'
import getPulseTypes from '../../handlers/http/pulseTypesHandlers'
import * as RecordHandlers from '../../handlers/http/recordHandlers'
import createDiagnosisValidator from '../../validators/httpRequests/createDiagnosisValidator'
import { RouteType } from './httpController.types'

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
  {
    method: 'get',
    route: '/record-latest',
    handler: RecordHandlers.getMostRecentRecord,
  },
  // Post Request
  {
    method: 'post',
    route: '/diagnosis',
    handler: DiagnosisHandler.createDiagnosis,
    validator: createDiagnosisValidator,
  },
  {
    method: 'post',
    route: '/data',
    handler: DiagnosisHandler.exportData,
  },
] as RouteType[]
