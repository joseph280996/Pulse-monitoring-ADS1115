export default interface ILoopHandler {
  start(): void
  stop(): void
  status(): string
}
