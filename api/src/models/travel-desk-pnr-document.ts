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

import { TravelDeskTravelRequest } from "./travel-desk-travel-request"

import sequelize from "@/db/db-client"

export class TravelDeskPnrDocument extends Model<
  InferAttributes<TravelDeskPnrDocument>,
  InferCreationAttributes<TravelDeskPnrDocument>
> {
  declare documentID: CreationOptional<number>
  declare requestID: ForeignKey<TravelDeskTravelRequest["requestID"]>
  declare pnrDocument: Buffer | null
  declare invoiceNumber: string | null

  declare getTravelDeskTravelRequest: BelongsToGetAssociationMixin<TravelDeskTravelRequest>
  declare setTravelDeskTravelRequest: BelongsToSetAssociationMixin<
    TravelDeskTravelRequest,
    TravelDeskTravelRequest["requestID"]
  >
  declare createTravelDeskTravelRequest: BelongsToCreateAssociationMixin<TravelDeskTravelRequest>

  declare travelDeskTravelRequest?: NonAttribute<TravelDeskTravelRequest>

  declare static associations: {
    travelDeskTravelRequest: Association<TravelDeskPnrDocument, TravelDeskTravelRequest>
  }

  static establishAssociations() {
    this.belongsTo(TravelDeskTravelRequest, {
      as: "travelDeskTravelRequest",
      foreignKey: "requestID",
    })
  }
}

TravelDeskPnrDocument.init(
  {
    documentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    requestID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "travelDeskTravelRequest", // using table name here, instead of Model class
        key: "requestID",
      },
      onDelete: "CASCADE",
    },
    pnrDocument: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "TravelDeskPnrDocument",
    tableName: "travelDeskPnrDocuments",
    underscored: false,
    timestamps: false,
  }
)

export default TravelDeskPnrDocument
