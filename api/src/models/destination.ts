import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

export class Destination extends Model<
  InferAttributes<Destination>,
  InferCreationAttributes<Destination>
> {
  declare id: CreationOptional<number>
  declare province: string
  declare city: string
}

Destination.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Destination",
    tableName: "destinations",
    timestamps: false,
  }
)
export default Destination
