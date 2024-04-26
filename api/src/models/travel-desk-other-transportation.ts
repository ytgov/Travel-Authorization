import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  NonAttribute,
  DataTypes,
} from "sequelize"

import sequelize from "@/db/db-client"

import TravelDeskTravelRequest from "@/models/travel-desk-travel-request"

/**
 * Keep in sync with web/src/api/travel-desk-other-transportations-api.js
 * TODO: normalizes these to snake_case
 */
export enum TravelDeskOtherTransportationStatuses {
  REQUESTED = "Requested",
  RESERVED = "Reserved",
}

/**
 * Keep in sync with web/src/api/travel-desk-other-transportations-api.js
 * TODO: normalizes these to snake_case
 */
export enum TransportationTypes {
  SHUTTLE = "Shuttle",
  BUS = "Bus",
  TRAIN = "Train",
}

export class TravelDeskOtherTransportation extends Model<
  InferAttributes<TravelDeskOtherTransportation>,
  InferCreationAttributes<TravelDeskOtherTransportation>
> {
  static readonly Statuses = TravelDeskOtherTransportationStatuses
  static readonly TransportationTypes = TransportationTypes

  declare id: CreationOptional<number>
  declare requestID: ForeignKey<TravelDeskTravelRequest["id"]>
  declare depart: string
  declare arrive: string
  declare transportationType: CreationOptional<string | null>
  declare date: Date
  declare additionalNotes: CreationOptional<string | null>
  declare status: string
  declare reservedTranspInfo: CreationOptional<string | null>
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
    travelRequest: Association<TravelDeskOtherTransportation, TravelDeskTravelRequest>
  }

  static establishAssociations() {
    this.belongsTo(TravelDeskTravelRequest, {
      as: "travelRequest",
      foreignKey: "travelRequestId",
    })
  }
}

TravelDeskOtherTransportation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    requestID: {
      field: "requestID",
      type: DataTypes.INTEGER,
      allowNull: false,
      // foreign key reference doesn't exist in database yet
      references: {
        model: TravelDeskTravelRequest,
        key: "id",
      },
    },
    depart: {
      field: "depart",
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    arrive: {
      field: "arrive",
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    transportationType: {
      field: "transportationType",
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isIn: {
          args: [Object.values(TransportationTypes)],
          msg: `Transportation type must be one of the following: ${Object.values(
            TransportationTypes
          ).join(", ")}`,
        },
      },
    },
    date: {
      field: "date",
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    additionalNotes: {
      field: "additionalNotes",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      field: "status",
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(TravelDeskOtherTransportationStatuses)],
          msg: `Status must be one of the following: ${Object.values(
            TravelDeskOtherTransportationStatuses
          ).join(", ")}`,
        },
      },
    },
    reservedTranspInfo: {
      field: "reservedTranspInfo",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    booking: {
      field: "booking",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
  }
)

export default TravelDeskOtherTransportation
