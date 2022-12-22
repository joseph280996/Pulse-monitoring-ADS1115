import { RequestHandler } from 'express'
import db from 'src/server/domain/models/DbConnectionModel'
import PulseType from 'src/server/domain/models/PulseTypes'
import { PulseTypeDataType } from 'src/server/domain/models/PulseTypes.types'
import * as PulseTypeSqls from 'src/server/domain/sqls/pulseTypeSqls'

const getPulseTypes: RequestHandler = async (_req, res) => {
  const pulseTypes = await db
    .query<PulseTypeDataType[], void>(PulseTypeSqls.GET_ALL)
    .then((result: PulseTypeDataType[]) => {
      if (result?.length > 0) {
        return result.map((row: PulseTypeDataType) => new PulseType(row))
      }
      return []
    })
  res.status(200).send(pulseTypes)
}

export default getPulseTypes
