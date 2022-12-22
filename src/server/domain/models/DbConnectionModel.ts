import { config } from 'dotenv'
import { Pool, createPool, MysqlError } from 'mysql'
import IDb from '../interfaces/IDb'

config()
const DBConf = {
  database: process.env.DATABASE_NAME || '',
  port: process.env.PORT ? +process.env.PORT : 3306,
  host: process.env.DATABASE_HOST || '',
  user: process.env.DATABASE_USER || '',
  password: process.env.DATABASE_PASSWORD || '',
  timezone: 'Z',
  charset: 'utf8mb4_unicode_ci',
}

export class DB implements IDb {
  private _pool?: Pool

  private getPool(): Pool | undefined {
    if (!this._pool) {
      const newPool = createPool({
        ...DBConf,
        debug:
          process.env.NODE_ENV === 'development' ? ['ComQueryPacket'] : false,
      })
      this.setPool(newPool)
    }
    return this._pool
  }

  private setPool(pool: Pool | undefined) {
    this._pool = pool
  }

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
}

export default new DB()
