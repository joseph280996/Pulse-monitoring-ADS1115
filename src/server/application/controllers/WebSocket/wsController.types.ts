import WebSocket from 'ws'

export type WebsocketMessageTypeHandler = {
  [operation:string]: (message: string, ws: WebSocket) => void
}
