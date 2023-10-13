export class BaseService {
  static async perform(...args: any[]): Promise<any> {
    // TODO: figure out how to abstact this with appropriate types
    throw new Error("Not Implemented")
  }

  async perform(): Promise<any> {
    throw new Error("Not Implemented")
  }
}

export default BaseService
