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

import TravelAuthorization from "./travel-authorization"

// Keep in sync with web/src/modules/travelForm/components/ExpenseTypeSelect.vue
// Avoid exporting here, and instead expose via the Expense model to avoid naming conflicts
enum ExpenseTypes {
  ACCOMODATIONS = "Accomodations",
  TRANSPORTATION = "Transportation",
  MEALS_AND_INCIDENTALS = "Meals & Incidentals",
}

// TODO: replace this with a boolean of isEstimate or
// move estimates to there own table.
// It's also possible that this is a single table inheritance model,
// and there should be two models, one for each "type".
// Avoid exporting here, and instead expose via the Expense model to avoid naming conflicts
enum Types {
  ESTIMATE = "Estimate",
  EXPENSE = "Expense",
}

export class Expense extends Model<InferAttributes<Expense>, InferCreationAttributes<Expense>> {
  static Types = Types
  static ExpenseTypes = ExpenseTypes

  declare id: CreationOptional<number>
  declare formId: ForeignKey<TravelAuthorization["id"]>
  declare description: string
  declare date: Date | null
  declare cost: number
  declare currency: string
  declare type: Types
  declare receiptImage: Buffer | null
  declare fileSize: number | null
  declare fileName: string | null
  declare expenseType: ExpenseTypes
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getTravelAuthorization: BelongsToGetAssociationMixin<TravelAuthorization>
  declare setTravelAuthorization: BelongsToSetAssociationMixin<TravelAuthorization, TravelAuthorization["id"]>
  declare createTravelAuthorization: BelongsToCreateAssociationMixin<TravelAuthorization>

  declare travelAuthorization?: NonAttribute<TravelAuthorization>

  declare static associations: {
    travelAuthorization: Association<Expense, TravelAuthorization>
  }

  static establishAssociations() {
    this.belongsTo(TravelAuthorization, {
      as: "travelAuthorization",
      foreignKey: "formId",
    })
  }
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    formId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "travel_authorizations", // using table name here, instead of Model class
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    receiptImage: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    expenseType: {
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
  },
  {
    sequelize,
    modelName: "Expense",
    tableName: "expenses",
    underscored: true,
    timestamps: true,
  }
)

export default Expense
