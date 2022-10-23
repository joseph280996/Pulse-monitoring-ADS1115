import { RequestHandler } from 'express'
import DBInstance from '../../models/DbConnectionModel'
import HandPosition from '../../models/HandPosition'
import { HandPositionType } from '../../models/HandPosition.types'
import * as HandPositionSqls from '../../sqls/handPositionSqls'

const getHandPositions: RequestHandler = async (_req, res) => {
  try {
    const result = await DBInstance.query<HandPositionType[], void>(
      HandPositionSqls.GET_ALL,
    )
    const handPositions =
      result?.length > 0
        ? result.map((row: HandPositionType) => new HandPosition(row))
        : []
    res.status(200).send(handPositions)
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Error')
  }
}

export default getHandPositions
