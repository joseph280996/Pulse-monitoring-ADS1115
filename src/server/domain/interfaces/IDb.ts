export default interface Idb {
  query(query: string, values: unknown): Promise<unknown>
  hasPoolOpened(): boolean
  cleanUp(): void
}
