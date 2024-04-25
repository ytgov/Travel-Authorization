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

  declare hotelID: CreationOptional<number>
  declare requestID: ForeignKey<TravelDeskTravelRequest["id"]>
  declare city: CreationOptional<string | null>
  declare rsvConferenceHotel: CreationOptional<boolean | null>
  declare conferenceName: CreationOptional<string | null>
  declare conferenceHotelName: CreationOptional<string | null>
  declare checkIn: CreationOptional<Date | null>
  declare checkOut: CreationOptional<Date | null>
  declare additionalInformation: CreationOptional<string | null>
  declare status: string
  declare reservedHotelInfo: CreationOptional<string | null>
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
    travelRequest: Association<TravelDeskHotel, TravelDeskTravelRequest>
  }

  static establishAssociations() {
    this.belongsTo(TravelDeskTravelRequest, {
      as: "travelRequest",
      foreignKey: "requestID",
    })
  }
}

TravelDeskHotel.init(
  {
    hotelID: {
      field: "hotelID",
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    requestID: {
      field: "requestID",
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TravelDeskTravelRequest,
        key: "id",
      },
    },
    city: {
      field: "city",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    rsvConferenceHotel: {
      field: "rsvConferenceHotel",
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    conferenceName: {
      field: "conferenceName",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    conferenceHotelName: {
      field: "conferenceHotelName",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    checkIn: {
      field: "checkIn",
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    checkOut: {
      field: "checkOut",
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    additionalInformation: {
      field: "additionalInformation",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      field: "status",
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
      field: "reservedHotelInfo",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    booking: {
      field: "booking",
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "TravelDeskHotel",
    tableName: "travelDeskHotel",
    underscored: false,
    timestamps: false,
    paranoid: false,
  }
)

export default TravelDeskHotel
