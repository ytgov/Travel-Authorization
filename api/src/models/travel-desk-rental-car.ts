import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  DataTypes,
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  NonAttribute,
} from "sequelize"

import sequelize from "@/db/db-client"
import TravelDeskTravelRequest from "@/models/travel-desk-travel-request"

export class TravelDeskRentalCar extends Model<
  InferAttributes<TravelDeskRentalCar>,
  InferCreationAttributes<TravelDeskRentalCar>
> {
  declare id: CreationOptional<number>
  declare travelRequestId: ForeignKey<TravelDeskTravelRequest["id"]>
  declare pickUpCity: string
  declare pickUpLocation: string
  declare pickUpLocationOther: CreationOptional<string | null>
  declare dropOffCity: CreationOptional<string | null>
  declare dropOffLocation: CreationOptional<string | null>
  declare dropOffLocationOther: CreationOptional<string | null>
  declare sameDropOffLocation: CreationOptional<boolean>
  declare matchFlightTimes: CreationOptional<boolean>
  declare vehicleTypeChangeIndicator: CreationOptional<string | null>
  declare vehicleType: string
  declare vehicleChangeRationale: string
  declare pickUpDate: Date
  declare dropOffDate: Date
  declare additionalNotes: CreationOptional<string | null>
  declare status: string
  declare reservedVehicleInfo: CreationOptional<string | null>
  declare booking: CreationOptional<string | null>
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
    travelRequest: Association<TravelDeskRentalCar, TravelDeskTravelRequest>
  }

  static establishAssociations() {
    this.belongsTo(TravelDeskTravelRequest, {
      as: "travelRequest",
      foreignKey: "travelRequestId",
    })
  }
}

TravelDeskRentalCar.init(
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
    pickUpCity: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pickUpLocation: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    pickUpLocationOther: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dropOffCity: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dropOffLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dropOffLocationOther: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    sameDropOffLocation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    matchFlightTimes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    vehicleTypeChangeIndicator: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    vehicleType: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vehicleChangeRationale: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pickUpDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dropOffDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    additionalNotes: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    reservedVehicleInfo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    booking: {
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    paranoid: false,
  }
)

export default TravelDeskRentalCar
