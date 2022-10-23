export default interface IRepository<I, R> {
  create(input: I): Promise<R>
  update(input: I): Promise<boolean>
  getByID(input: number): Promise<R>
}
