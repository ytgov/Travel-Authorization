export class BaseModel {
  static async findAll({
    where = {},
    include = [],
    limit = 10,
    offset = 0,
  }): Promise<any> {
    throw new Error('Not implemented.');
  }
}

export default BaseModel
