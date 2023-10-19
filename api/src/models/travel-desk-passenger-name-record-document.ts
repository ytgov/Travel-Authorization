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

import TravelDeskTravelRequest from "./travel-desk-travel-request"

import sequelize from "@/db/db-client"

export class TravelDeskPassengerNameRecordDocument extends Model<
  InferAttributes<TravelDeskPassengerNameRecordDocument>,
  InferCreationAttributes<TravelDeskPassengerNameRecordDocument>
> {
  declare id: CreationOptional<number>
  declare travelDeskTravelRequestId: ForeignKey<TravelDeskTravelRequest["requestID"]>
  declare pnrDocument: Buffer | null
  declare invoiceNumber: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare getTravelDeskTravelRequest: BelongsToGetAssociationMixin<TravelDeskTravelRequest>
  declare setTravelDeskTravelRequest: BelongsToSetAssociationMixin<
    TravelDeskTravelRequest,
    TravelDeskTravelRequest["requestID"]
  >
  declare createTravelDeskTravelRequest: BelongsToCreateAssociationMixin<TravelDeskTravelRequest>

  declare travelDeskTravelRequest?: NonAttribute<TravelDeskTravelRequest>

  declare static associations: {
    travelDeskTravelRequest: Association<
      TravelDeskPassengerNameRecordDocument,
      TravelDeskTravelRequest
    >
  }

  static establishAssociations() {
    // TODO: enable this once TravelDeskTravelRequest model is set up
    // this.belongsTo(TravelDeskTravelRequest, {
    //   as: "travelDeskTravelRequest",
    //   foreignKey: "travelDeskTravelRequestId",
    // })
  }
}

TravelDeskPassengerNameRecordDocument.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    travelDeskTravelRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "travelDeskTravelRequest", // using real table name here
        key: "requestID", // using real column name here
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "TravelDeskPassengerNameRecordDocument",
    tableName: "travel_desk_passenger_name_record_documents",
  }
)

export default TravelDeskPassengerNameRecordDocument
