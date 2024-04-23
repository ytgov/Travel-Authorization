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
  declare rentalVehicleID: CreationOptional<number>
  declare requestID: ForeignKey<TravelDeskTravelRequest["id"]>
  declare pickUpCity: string
  declare pickUpLocation: string
  declare pickUpLocOther: CreationOptional<string | null>
  declare dropOffCity: CreationOptional<string | null>
  declare dropOffLocation: CreationOptional<string | null>
  declare dropOffLocOther: CreationOptional<string | null>
  declare sameDropOffLocation: CreationOptional<boolean>
  declare matchFlightTimes: CreationOptional<boolean>
  declare vehicleTypeChangeInd: CreationOptional<string | null>
  declare vehicleType: string
  declare vehicleChangeRationale: string
  declare pickUpDate: Date
  declare dropOffDate: Date
  declare additionalNotes: CreationOptional<string | null>
  declare status: string
  declare reservedVehicleInfo: CreationOptional<string | null>
  declare booking: CreationOptional<string | null>

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
    rentalVehicleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: "rentalVehicleID",
    },
    requestID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "requestID",
      references: {
        model: TravelDeskTravelRequest,
        key: "id",
      },
    },
    pickUpCity: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "pickUpCity",
    },
    pickUpLocation: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "pickUpLocation",
    },
    pickUpLocOther: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "pickUpLocOther",
    },
    dropOffCity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "dropOffCity",
    },
    dropOffLocation: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "dropOffLocation",
    },
    dropOffLocOther: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "dropOffLocOther",
    },
    sameDropOffLocation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "sameDropOffLocation",
    },
    matchFlightTimes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "matchFlightTimes",
    },
    vehicleTypeChangeInd: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "vehicleTypeChangeInd",
    },
    vehicleType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "vehicleType",
    },
    vehicleChangeRationale: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "vehicleChangeRationale",
    },
    pickUpDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "pickUpDate",
    },
    dropOffDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "dropOffDate",
    },
    additionalNotes: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "additionalNotes",
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "status",
    },
    reservedVehicleInfo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "reservedVehicleInfo",
    },
    booking: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "booking",
    },
  },
  {
    sequelize,
    modelName: "TravelDeskRentalCar",
    tableName: "travelDeskRentalCar",
    underscored: false,
    timestamps: false,
    paranoid: false,
  }
)

export default TravelDeskRentalCar
