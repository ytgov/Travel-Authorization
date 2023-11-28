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

import Location from "./location"
import TravelAuthorization from "./travel-authorization"

const BEGINNING_OF_DAY = "00:00:00"
const END_OF_DAY = "23:59:59"

// Keep in sync with web/src/api/stops-api.js
// Until both are using a shared location
// Avoid exporting here, and instead expose via the Expense model to avoid naming conflicts
enum TravelMethods {
  AIRCRAFT = "Aircraft",
  POOL_VEHICLE = "Pool Vehicle",
  PERSONAL_VEHICLE = "Personal Vehicle",
  RENTAL_VEHICLE = "Rental Vehicle",
  BUS = "Bus",
  // TODO: replace other type with specific values
  // OTHER = "Other:"
}

// Keep in sync with web/src/api/stops-api.js
// Until both are using a shared location
// Avoid exporting here, and instead expose via the Expense model to avoid naming conflicts
enum AccommodationTypes {
  HOTEL = "Hotel",
  PRIVATE = "Private",
  // TODO: replace other type with specific values
  // OTHER = "Other:",
}

export class TravelSegment extends Model<
  InferAttributes<TravelSegment>,
  InferCreationAttributes<TravelSegment>
> {
  static TravelMethods = TravelMethods
  static AccommodationTypes = AccommodationTypes
  static BEGINNING_OF_DAY = BEGINNING_OF_DAY
  static END_OF_DAY = END_OF_DAY

  declare id: CreationOptional<number>
  declare travelAuthorizationId: ForeignKey<TravelAuthorization["id"]>
  declare departureLocationId: ForeignKey<Location["id"]> | null
  declare arrivalLocationId: ForeignKey<Location["id"]> | null
  declare segmentNumber: number
  declare departureOn: Date | null
  declare departureTime: string | null
  declare modeOfTransport: string
  declare modeOfTransportOther: string | null
  declare accommodationType: string | null
  declare accommodationTypeOther: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getTravelAuthorization: BelongsToGetAssociationMixin<TravelAuthorization>
  declare setTravelAuthorization: BelongsToSetAssociationMixin<
    TravelAuthorization,
    TravelAuthorization["id"]
  >
  declare createTravelAuthorization: BelongsToCreateAssociationMixin<TravelAuthorization>

  declare getDepartureLocation: BelongsToGetAssociationMixin<Location>
  declare setDepartureLocation: BelongsToSetAssociationMixin<Location, Location["id"]>
  declare createDepartureLocation: BelongsToCreateAssociationMixin<Location>

  declare getArrivalLocation: BelongsToGetAssociationMixin<Location>
  declare setArrivalLocation: BelongsToSetAssociationMixin<Location, Location["id"]>
  declare createArrivalLocation: BelongsToCreateAssociationMixin<Location>

  declare travelAuthorization?: NonAttribute<TravelAuthorization>
  declare departureLocation?: NonAttribute<Location>
  declare arrivalLocation?: NonAttribute<Location>

  declare static associations: {
    travelAuthorization: Association<TravelSegment, TravelAuthorization>
    departureLocation: Association<TravelSegment, Location>
    arrivalLocation: Association<TravelSegment, Location>
  }

  static establishAssociations() {
    this.belongsTo(TravelAuthorization, {
      as: "travelAuthorization",
      foreignKey: "travelAuthorizationId",
      onDelete: "CASCADE",
    })
    this.belongsTo(Location, {
      as: "departureLocation",
      foreignKey: "departureLocationId",
      onDelete: "RESTRICT",
    })
    this.belongsTo(Location, {
      as: "arrivalLocation",
      foreignKey: "arrivalLocationId",
      onDelete: "RESTRICT",
    })
  }
}

TravelSegment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    travelAuthorizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departureLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    arrivalLocationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    segmentNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departureOn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    modeOfTransport: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    modeOfTransportOther: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    accommodationType: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    accommodationTypeOther: {
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
  }
)

export default TravelSegment
