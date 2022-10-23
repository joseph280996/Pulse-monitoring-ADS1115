export default interface ILoopService {
  start(): void
  stop(): void
  status(): string
}
