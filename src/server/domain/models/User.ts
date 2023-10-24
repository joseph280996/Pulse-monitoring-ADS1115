import { genSalt, hash } from 'bcrypt'
import DB from '../../infrastructure/services/DbService'

// TODO: Clean this up

type UserInputType = {
  id?: number
  firstName: string
  lastName?: string
  password: string
}

class User {
  //#region constant properties
  private readonly saltRounds = 12
  private static readonly sqlFields =
    'id as userId, passwordHash, firstName, lastName'
  //#endregion

  //#region Properties
  private passwordHash?: string
  public id?: number
  public password: string
  public firstName: string
  public lastName?: string
  //#endregion

  //#region Constructor
  constructor(obj: UserInputType) {
    this.password = obj.password
    this.id = obj.id
    this.firstName = obj.firstName
    this.lastName = obj.lastName
  }
  //#endregion

  //#region Public Methods
  static async getUserById(id: number): Promise<User | null> {
    const result = await DB.query<User, Array<number>>(
      `SELECT ${User.sqlFields} FROM User WHERE id=?;`,
      [id],
    )
    return result ? new User(result) : null
  }

  async save(): Promise<boolean> {
    if (this.id) {
      const foundUser = await User.getUserById(this.id)
      if (foundUser) {
        return true
      }
      throw new Error('Cannot find user with given Id')
    }
    if (!this.password) {
      throw new Error('Password is required to create a user')
    }
    await this.encryptPassword()
    const res = await DB.query<
      { insertId: number },
      Array<[string | undefined, string, string | undefined]>
    >(
      `
      INSERT INTO User(passwordHash, firstName, lastName)
      VALUES (?)
    `,
      [[this.passwordHash, this.firstName, this.lastName]],
    )
    return !!res.insertId
  }
  //#endregion

  //#region Public Methods
  private async encryptPassword() {
    try {
      if (!this.password) {
        throw new Error('Password is required for encryption')
      }
      const { password } = this
      const salt = await genSalt(this.saltRounds)
      const hashedPassword = await hash(password, salt)
      this.passwordHash = hashedPassword
    } catch (err) {
      console.error(err)
      throw new Error('Error hashing password')
    }
  }
  //#endregion
}

export default User
