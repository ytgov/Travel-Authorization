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

export class TravelDeskPassengerNameRecordDocument extends Model<
  InferAttributes<TravelDeskPassengerNameRecordDocument>,
  InferCreationAttributes<TravelDeskPassengerNameRecordDocument>
> {
  declare id: CreationOptional<number>
  declare travelDeskTravelRequestId: ForeignKey<TravelDeskTravelRequest["requestID"]>
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
        key: "travel_desk_travel_request_id", // using real key name here
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
    modelName: "TravelDeskPassengerNameRecordDocument",
    tableName: "travel_desk_passenger_name_record_documents",
    timestamps: false,
  }
)

export default TravelDeskPassengerNameRecordDocument
