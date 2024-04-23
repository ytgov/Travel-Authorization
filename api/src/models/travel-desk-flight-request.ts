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

/**
 * Keep in sync with web/src/api/travel-desk-flight-requests-api.js
 *
 * TODO: standardize (lowercase and underscore) these values
 */
export enum SeatPreferencesTypes {
  WINDOW = "Window",
  AISLE = "Aisle",
  MIDDLE = "Middle",
  NO_PREFERENCE = "No Preference",
}

export class TravelDeskFlightRequest extends Model<
  InferAttributes<TravelDeskFlightRequest>,
  InferCreationAttributes<TravelDeskFlightRequest>
> {
  static readonly SeatPreferencesTypes = SeatPreferencesTypes

  declare id: CreationOptional<number>
  declare travelRequestId: ForeignKey<TravelDeskTravelRequest["id"]>
  declare departLocation: string
  declare arriveLocation: string
  declare datePreference: Date
  declare timePreference: string
  declare seatPreference: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare deletedAt: CreationOptional<Date | null>

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
      foreignKey: "travelRequestId",
    })
  }
}

TravelDeskFlightRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    travelRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TravelDeskTravelRequest,
        key: "id",
      },
    },
    departLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    arriveLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    datePreference: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    timePreference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seatPreference: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(SeatPreferencesTypes)],
          msg: "Invalid seat preference value",
        },
      },
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    paranoid: true, // TODO: remove once parnoid is default.
  }
)

export default TravelDeskFlightRequest
