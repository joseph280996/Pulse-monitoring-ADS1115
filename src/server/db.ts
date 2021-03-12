import { Pool, createPool, MysqlError } from 'mysql'

interface DBInterface {
  query(query: string, values: unknown): Promise<unknown>
}

const DBConf = {
  database: 'pulsemonitoring',
  multiStatements: true,
  host: '127.0.0.1',
  user: 'pulsemonitoring',
  password: 'Jpxt280996@1406',
  timezone: 'Z',
  charset: 'utf8mb4_unicode_ci',
}

class DB implements DBInterface {
  private pool!: Pool

  constuctor() {
    if (!this.pool) {
      this.pool = createPool(DBConf)
    }
  }

  query(query: string, values?: Array<any>) {
    return new Promise<unknown>((resolve, reject) => {
      this.pool.query(
        query,
        values,
        (error: MysqlError | null, result: unknown) => {
          if (error) {
            return reject(error)
          }
          return resolve(result)
        },
      )
    })
  }
}

export default new DB()
