export default interface IDb {
  query<TReturn, TInput>(query: string, values?: TInput): Promise<TReturn>
  hasPoolOpened(): boolean
  cleanUp(): void
}
