export default class Singleton {
  protected static _instance: Singleton;

  static get instance(): Singleton {
    if (!this.instance) {
      this._instance = new Singleton()
    }

    return this._instance
  }

  constructor() {
    if (Singleton.instance) {
      throw new Error(
        'Singleton class should not be instantiate. Please use instance property instead',
      )
    }
  }
}
