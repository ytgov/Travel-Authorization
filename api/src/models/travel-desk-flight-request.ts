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

import sequelize from "@/db/db-client"

import TravelDeskTravelRequest from "@/models/travel-desk-travel-request"

export class TravelDeskFlightRequest extends Model<
  InferAttributes<TravelDeskFlightRequest>,
  InferCreationAttributes<TravelDeskFlightRequest>
> {
  declare flightRequestId: CreationOptional<number>
  declare requestId: ForeignKey<TravelDeskTravelRequest["id"]>
  declare departLocation: string
  declare arriveLocation: string
  declare date: Date
  declare timePreference: string
  declare seatPreference: string

  // Associations
  declare getTravelRequest: BelongsToGetAssociationMixin<TravelDeskTravelRequest>
  declare setTravelRequest: BelongsToSetAssociationMixin<
    TravelDeskTravelRequest,
    TravelDeskTravelRequest["id"]
  >
  declare createTravelRequest: BelongsToCreateAssociationMixin<TravelDeskTravelRequest>

  declare travelRequest: NonAttribute<TravelDeskTravelRequest>

  declare static associations: {
    travelRequest: Association<TravelDeskFlightRequest, TravelDeskTravelRequest>
  }

  static establishAssociations() {
    this.belongsTo(TravelDeskTravelRequest, {
      as: "travelRequest",
      foreignKey: "requestID",
    })
  }
}

TravelDeskFlightRequest.init(
  {
    flightRequestId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "flightRequestID",
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TravelDeskTravelRequest,
        key: "id",
      },
      field: "requestID",
    },
    departLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "departLocation",
    },
    arriveLocation: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "arriveLocation",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    timePreference: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "timePreference",
    },
    seatPreference: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "seatPreference",
    },
  },
  {
    sequelize,
    // TODO: remove after normalizing table and field names.
    modelName: "TravelDeskFlightRequest",
    tableName: "travelDeskFlightRequest",
    underscored: false,
    timestamps: false,
    paranoid: false,
  }
)

export default TravelDeskFlightRequest
