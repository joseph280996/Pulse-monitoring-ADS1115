export default interface IDb {
  query(query: string, values: unknown): Promise<unknown>
  hasPoolOpened(): boolean
  cleanUp(): void
}
