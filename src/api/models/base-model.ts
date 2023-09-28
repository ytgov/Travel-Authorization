export type CountResult = string | number | undefined

export class BaseModel {
  static count({ where = {} }: { where?: {} } = {}): Promise<CountResult> {
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
  } = {}): Promise<{ count: CountResult; rows: any[] }> {
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
