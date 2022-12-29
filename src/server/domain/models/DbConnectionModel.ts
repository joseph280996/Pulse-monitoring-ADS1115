import { config } from 'dotenv'
import { MysqlError, Pool, createPool } from 'mysql'
import IDb from '../interfaces/IDb'

config()
export class DB implements IDb {
  //#region properties
  private _pool?: Pool
  private static readonly DBConf = {
    database: process.env.DATABASE_NAME || '',
    port: process.env.PORT ? +process.env.PORT : 3306,
    host: process.env.DATABASE_HOST || '',
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD || '',
    timezone: 'Z',
    charset: 'utf8mb4_unicode_ci',
  }

  //#endregion

  //#region public methods
  hasPoolOpened = () => Boolean(this._pool)

  query<T, K>(query: string, values?: K) {
    return new Promise<T>((resolve, reject) => {
      this.getPool()?.query(
        query,
        values,
        (error: MysqlError | null, result: T) => {
          if (error) {
            return reject(error)
          }
          return resolve(result)
        },
      )
    })
  }

  cleanUp = () => {
    const pool = this.getPool()
    if (pool) {
      pool.end()
    }
  }
  //#endregion

  //#region private methods
  private createPool() {
    try {
      const newPool = createPool({
        ...DB.DBConf,
        debug:
          process.env.NODE_ENV === 'development' ? ['ComQueryPacket'] : false,
      })
      this.setPool(newPool)
    } catch (error) {
      throw new Error(
        `Error creating DB connection pool: ${(error as Error).message}`,
      )
    }
  }

  private getPool(): Pool | undefined {
    if (!this._pool) {
      this.createPool()
    }
    return this._pool
  }

  private setPool(pool: Pool | undefined) {
    this._pool = pool
  }
  //#endregion
}

export default new DB()
