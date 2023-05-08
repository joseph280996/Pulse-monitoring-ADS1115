export default interface IRepository<I, R> {
  create(input: I): Promise<R>
  update(input: I): Promise<boolean>
  getById(input: number): Promise<R>
}
