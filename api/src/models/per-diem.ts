import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

export enum ClaimTypes {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
  INCIDENTALS = "incidentals",
  PRIVATE_ACCOMMODATIONS = "private_accommodations",
}

export enum TravelRegions {
  US = "US",
  YUKON = "Yukon",
  NWT = "NWT",
  CANADA = "Canada",
  NUNAVUT = "Nunavut",
  ALASKA = "Alaska",
}

export enum CurrencyTypes {
  USD = "USD",
  CAD = "CAD",
}

export class PerDiem extends Model<InferAttributes<PerDiem>, InferCreationAttributes<PerDiem>> {
  static ClaimTypes = ClaimTypes
  static TravelRegions = TravelRegions
  static CurrencyTypes = CurrencyTypes

  declare id: CreationOptional<number>
  declare claimType: ClaimTypes
  declare travelRegion: TravelRegions
  declare amount: number
  declare currency: CurrencyTypes
}

PerDiem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    claimType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(ClaimTypes)],
          msg: `Claim Type must be one of: ${Object.values(ClaimTypes).join(", ")}`,
        },
      },
    },
    travelRegion: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(TravelRegions)],
          msg: `Travel Region must be one of: ${Object.values(TravelRegions).join(", ")}`,
        },
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ["claimType", "travelRegion", "currency"],
        name: "per_diems_claim_type_travel_region_currency_unique",
        where: {
          deletedAt: null,
        },
      },
    ],
  }
)

export default PerDiem
