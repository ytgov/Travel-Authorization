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
import TravelDeskTravelRequest from "@/models/travel-desk-travel-request"

// TODO: normalize these to lower case, and add UI translations to web/src/locales/en.js
export enum TravelDeskQuestionRequestTypes {
  FLIGHT = "Flight",
  HOTEL = "Hotel",
  TRANSPORTATION = "Transportation",
  RENTAL_CAR = "Rental Car",
}

export class TravelDeskQuestion extends Model<
  InferAttributes<TravelDeskQuestion>,
  InferCreationAttributes<TravelDeskQuestion>
> {
  static readonly RequestTypes = TravelDeskQuestionRequestTypes

  declare questionID: CreationOptional<number>
  declare requestID: ForeignKey<TravelDeskTravelRequest["id"]>
  declare creatingDate: Date
  declare requestType: string
  declare question: string
  declare response: string | null

  // Associations
  declare travelRequest?: NonAttribute<TravelDeskTravelRequest>

  declare static associations: {
    travelRequest: Association<TravelDeskQuestion, TravelDeskTravelRequest>
  }

  static establishAssociations() {
    this.belongsTo(TravelDeskTravelRequest, {
      foreignKey: "requestID",
      as: "travelRequest",
    })
  }
}

TravelDeskQuestion.init(
  {
    questionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    requestID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TravelDeskTravelRequest,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    creatingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    requestType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: [Object.values(TravelDeskQuestionRequestTypes)],
        msg: `Request type must be one of ${Object.values(TravelDeskQuestionRequestTypes).join(", ")}`,
      },
    },
    question: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    response: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "TravelDeskQuestion",
    tableName: "travelDeskQuestion",
    underscored: false,
    timestamps: false,
    paranoid: false,
  }
)

export default TravelDeskQuestion
