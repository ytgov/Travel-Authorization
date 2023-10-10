import { type Knex } from "knex"

export type OrderDirection = "ASC" | "DESC"
export type OrderParam = string | [string, OrderDirection]

export class BaseModel {
  static count({ where = {} }: { where?: {} } = {}): Promise<number> {
    throw new Error("Not Implemented")
  }

  static async findAndCountAll({
    where = {},
    include = [],
    limit = 1000,
    offset = 0,
  }: {
    where?: {}
    include?: string[]
    limit?: number
    offset?: number
  } = {}): Promise<{ count: number; rows: any[] }> {
    throw new Error("Not Implemented")
  }

  static async findAll({
    where = {},
    include = [],
    order = [],
    limit = 1000,
    offset = 0,
  }: {
    where?: {}
    include?: string[]
    order?: OrderParam[]
    limit?: number
    offset?: number
  } = {}): Promise<any[]> {
    throw new Error("Not Implemented")
  }

  static async findByPk(
    id: number | string,
    { include = [] }: { include?: string[] } = {}
  ): Promise<any> {
    throw new Error("Not implemented")
  }

  protected static applyOrder(query: Knex.QueryBuilder, order: OrderParam[]) {
    order.forEach((ordering) => {
      if (typeof ordering === "string") {
        query.orderBy(ordering)
      } else if (Array.isArray(ordering)) {
        const [column, direction] = ordering
        query.orderBy(column, direction)
      }
    })
  }
}

export default BaseModel
