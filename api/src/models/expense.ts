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

import Form from "./form"

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
  ESTIMATE = "Estimates",
  EXPENSE = "Expenses",
}

export class Expense extends Model<InferAttributes<Expense>, InferCreationAttributes<Expense>> {
  static Types = Types
  static ExpenseTypes = ExpenseTypes

  declare id: CreationOptional<number>
  declare formId: ForeignKey<Form["id"]>
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
    this.belongsTo(Form, {
      as: "form",
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
        model: "forms", // using table name here, instead of Model class
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
  },
  {
    sequelize,
    modelName: "Expense",
    tableName: "expenses",
    underscored: true,
    timestamps: false,
  }
)

export default Expense
