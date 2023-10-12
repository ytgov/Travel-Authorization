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

import sequelize from "../db/db-client"

import Form from "./form"

// Keep in sync with src/web/src/modules/travelForm/components/ExpenseTypeSelect.vue
export enum ExpenseTypes {
  ACCOMODATIONS = "Accomodations",
  TRANSPORTATION = "Transportation",
  MEALS_AND_INCIDENTALS = "Meals & Incidentals",
}

// TODO: replace this with a boolean of isEstimate or
// move estimates to there own table.
// It's also possible that this is a single table inheritance model,
// and there should be two models, one for each "type".
export enum Types {
  ESTIMATE = "Estimates",
  EXPENSE = "Expenses",
}

export class Expense extends Model<InferAttributes<Expense>, InferCreationAttributes<Expense>> {
  declare id: CreationOptional<number>
  declare taid: ForeignKey<Form["id"]>
  declare description: string
  declare date: Date | null
  declare cost: number
  declare currency: string
  declare type: Types
  declare receiptImage: Buffer | null
  declare fileSize: number | null
  declare fileName: string | null
  declare expenseType: ExpenseTypes

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getForm: BelongsToGetAssociationMixin<Form>
  declare setForm: BelongsToSetAssociationMixin<Form, Form["id"]>
  declare createForm: BelongsToCreateAssociationMixin<Form>

  declare form?: NonAttribute<Form>

  declare static associations: {
    form: Association<Expense, Form>
  }

  static establishAssociations() {
    this.belongsTo(Form, { foreignKey: "taid" })
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
    taid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "forms",
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
      field: "receiptImage",
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "fileSize",
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "fileName",
    },
    expenseType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "expenseType",
    },
  },
  {
    sequelize,
    modelName: "Expense",
    tableName: "expenses",
    timestamps: false,
  }
)

export default Expense
