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
import { range } from "lodash"

import sequelize from "@/db/db-client"

import User from "@/models/user"

export const FlightReconciliationReconcilePeriods = Object.freeze(range(1, 13).concat(14)) // 1-12, 14

export class FlightReconciliation extends Model<
  InferAttributes<FlightReconciliation>,
  InferCreationAttributes<FlightReconciliation>
> {
  static readonly ReconcilePeriods = FlightReconciliationReconcilePeriods

  declare id: CreationOptional<number>
  declare reconcilerId: ForeignKey<User["id"]>
  declare externalTravComIdentifier: number // References the external database TravCom -> ARInvoiceDetailsNoHealth -> InvoiceDetailID
  declare reconciled: CreationOptional<boolean>
  declare reconcilePeriod: number | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare deletedAt: CreationOptional<Date | null>

  // Associations
  declare reconciler: NonAttribute<User>

  declare static associations: {
    reconciler: Association<FlightReconciliation, User>
  }

  static establishAssociations() {
    this.belongsTo(User, {
      as: "reconciler",
      foreignKey: "reconcilerId",
    })
  }
}

FlightReconciliation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    reconcilerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    externalTravComIdentifier: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    reconciled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reconcilePeriod: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isIn: {
          args: [[...FlightReconciliationReconcilePeriods, null]],
          msg: `Reconcile period must be one of: ${[
            ...FlightReconciliationReconcilePeriods,
            null,
          ].join(", ")}`,
        },
      },
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
      defaultValue: null,
    },
  },
  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ["externalTravComIdentifier"],
        where: {
          deletedAt: null,
        },
      },
    ],
  }
)

export default FlightReconciliation
