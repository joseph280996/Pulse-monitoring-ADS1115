import { RequestHandler } from 'express'
export type RouteType = {
  method: string
  route: string
  handler: RequestHandler
}
