import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"

import sequelize from "../db/db-client"

import Destination from "./destination"
import Form from "./form"

export class Stop extends Model<InferAttributes<Stop>, InferCreationAttributes<Stop>> {
  declare id: CreationOptional<number>
  declare taid: ForeignKey<Form["id"]>
  declare locationId: ForeignKey<Destination["id"]>
  declare departureDate: Date | null
  declare departureTime: string | null
  declare transport: string | null
  declare accommodationType: string | null

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getLocation: BelongsToGetAssociationMixin<Destination>
  declare setLocation: BelongsToSetAssociationMixin<Destination, Destination["id"]>
  declare createLocation: BelongsToCreateAssociationMixin<Destination>

  declare location?: NonAttribute<Destination>

  declare static associations: {
    location: Association<Stop, Destination>
  }

  static establishAssociations() {
    this.belongsTo(Destination)
  }
}

Stop.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    taid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "forms",
        key: "id",
      },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "locationId",
      references: {
        model: "destinations",
        key: "id",
      },
    },
    departureDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "departureDate",
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: "departureTime",
    },
    transport: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    accommodationType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "accommodationType",
    },
  },
  {
    sequelize,
    modelName: "Stop",
    tableName: "stops",
    timestamps: false,
  }
)

export default Stop
