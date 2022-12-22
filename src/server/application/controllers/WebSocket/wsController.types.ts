import WebSocket from 'ws'

export type WebsocketMessageTypeHandler = {
  regExp: RegExp
  handler: (message: string, ws: WebSocket) => void
}
