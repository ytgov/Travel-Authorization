export class BaseModel {
  static count({ where = {} }: { where?: {} } = {}): Promise<number> {
    throw new Error("Method not implemented.")
  }

  static async findAndCountAll({
    where = {},
    include = [],
    limit = 10,
    offset = 0,
  }: {
    where?: {}
    include?: string[]
    limit?: number
    offset?: number
  } = {}): Promise<{ count: number; rows: any[] }> {
    throw new Error("Method not implemented.")
  }

  static async findAll({
    where = {},
    include = [],
    limit = 10,
    offset = 0,
  }: {
    where?: {}
    include?: string[]
    limit?: number
    offset?: number
  } = {}): Promise<any[]> {
    throw new Error("Not implemented.")
  }
}

export default BaseModel
