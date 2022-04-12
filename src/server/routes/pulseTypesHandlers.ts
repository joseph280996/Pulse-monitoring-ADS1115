import { RequestHandler } from 'express'
import PulseType from '../models/PulseTypes'

const getPulseTypes: RequestHandler = async (_req, res) => {
  const pulseTypes = await PulseType.loadAll()
  res.status(200).send(pulseTypes)
}

export default getPulseTypes
