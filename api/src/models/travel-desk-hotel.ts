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

export enum TravelDeskHotelStatuses {
  REQUESTED = "Requested",
  // TODO: confirm this is correct.
  RESERVED = "Reserved", // Uncofirmed, but seems likely.
}

export class TravelDeskHotel extends Model<
  InferAttributes<TravelDeskHotel>,
  InferCreationAttributes<TravelDeskHotel>
> {
  static readonly Statuses = TravelDeskHotelStatuses

  declare id: CreationOptional<number>
  declare travelRequestId: ForeignKey<TravelDeskTravelRequest["id"]>
  declare city: string
  declare isDedicatedConferenceHotelAvailable: boolean
  declare conferenceName: string
  declare conferenceHotelName: string
  declare checkIn: Date
  declare checkOut: Date
  declare additionalInformation: CreationOptional<string | null>
  declare status: string
  declare reservedHotelInfo: CreationOptional<string | null>
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
    travelRequest: Association<TravelDeskHotel, TravelDeskTravelRequest>
  }

  static establishAssociations() {
    this.belongsTo(TravelDeskTravelRequest, {
      as: "travelRequest",
      foreignKey: "travelRequestId",
    })
  }
}

TravelDeskHotel.init(
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
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isDedicatedConferenceHotelAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    conferenceName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    conferenceHotelName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    additionalInformation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(TravelDeskHotelStatuses)],
          msg: `Status must be one of the following: ${Object.values(TravelDeskHotelStatuses).join(
            ", "
          )}`,
        },
      },
    },
    reservedHotelInfo: {
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
  }
)

export default TravelDeskHotel
