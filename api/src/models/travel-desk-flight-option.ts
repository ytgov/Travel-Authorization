import {
  Association,
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"

import sequelize from "@/db/db-client"
import TravelDeskFlightRequest from "@/models/travel-desk-flight-request"
import TravelDeskFlightSegment from "@/models/travel-desk-flight-segment"
import User from "@/models/user"

// TODO: Set up flight preference order of -1, meaning "does not work"
// const FLIGHT_DOES_NOT_WORK = -1

class TravelDeskFlightOption extends Model<
  InferAttributes<TravelDeskFlightOption>,
  InferCreationAttributes<TravelDeskFlightOption>
> {
  declare id: CreationOptional<number>
  declare flightRequestId: ForeignKey<TravelDeskFlightRequest["id"]>
  declare travelerId: ForeignKey<User["id"]>
  declare cost: string
  declare flightPreferenceOrder: string | null
  declare leg: string // TODO: validate if "leg" is being used?
  declare duration: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare deletedAt: CreationOptional<Date>

  // Associations
  declare flightRequest?: NonAttribute<TravelDeskFlightRequest>
  declare traveler?: NonAttribute<User>
  declare flightSegments?: NonAttribute<TravelDeskFlightSegment[]>

  declare static associations: {
    flightRequest: Association<TravelDeskFlightOption, TravelDeskFlightRequest>
    traveler: Association<TravelDeskFlightOption, User>
    flightSegments: Association<TravelDeskFlightOption, TravelDeskFlightSegment>
  }

  static establishAssociations() {
    this.belongsTo(TravelDeskFlightRequest, {
      as: "flightRequest",
      foreignKey: "flightRequestId",
    })
    this.belongsTo(User, {
      as: "traveler",
      foreignKey: "travelerId",
    })
    this.hasMany(TravelDeskFlightSegment, {
      as: "flightSegments",
      foreignKey: "flightOptionId",
    })
  }
}

TravelDeskFlightOption.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    flightRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TravelDeskFlightRequest,
        key: "id",
      },
    },
    travelerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    cost: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    flightPreferenceOrder: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // TODO: validate if "leg" is being used?
    leg: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    scopes: {
      forTravelRequest(travelDeskTravelRequestId) {
        return {
          include: [
            {
              association: "flightRequest",
              where: {
                travelRequestId: travelDeskTravelRequestId,
              },
            },
          ],
        }
      }
    }
  }
)

export default TravelDeskFlightOption
