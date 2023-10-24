export class BaseService {
  constructor(...args: any[]) {}

  static perform<T extends typeof BaseService>(
    this: T,
    ...args: ConstructorParameters<T>
  ): ReturnType<InstanceType<T>["perform"]> {
    const instance = new this(...args)
    return instance.perform()
  }

  perform(): any {
    throw new Error("Not Implemented")
  }
}

export default BaseService
