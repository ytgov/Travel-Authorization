import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize"

import sequelize from "../db/db-client"

export class TravelPurpose extends Model<
  InferAttributes<TravelPurpose>,
  InferCreationAttributes<TravelPurpose>
> {
  declare id: CreationOptional<number>
  declare purpose: string
}

TravelPurpose.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "travelPurpose",
    modelName: "TravelPurpose",
    timestamps: false,
  }
)

export default TravelPurpose
