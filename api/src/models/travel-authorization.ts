import {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"

import sequelize from "@/db/db-client"

import Expense from "./expense"
import Preapproved from "./preapproved"
import Stop from "./stop"
import TravelDeskTravelRequest from "./travel-desk-travel-request"
import TravelPurpose from "./travel-purpose"
import User from "./user"

// TODO: state management is going to be a bit deal for this project
// we should do some aggressive data modeling an engineering before this becomes unmagable
// Avoid exporting here, and instead expose via the Expense model to avoid naming conflicts
enum Statuses {
  // TODO: might want replace DELETED status with `deleted_at` field from Sequelize paranoid feature.
  // See https://sequelize.org/docs/v6/core-concepts/paranoid/
  DELETED = "deleted",
  APPROVED = "approved",
  AWAITING_DIRECTOR_APPROVAL = "awaiting_director_approval",
  BOOKED = "booked",
  CHANGE_REQUESTED = "change_requested",
  DENIED = "denied",
  DRAFT = "draft",
  EXPENSE_CLAIM = "expense_claim",
  EXPENSED = "expensed",
  SUBMITTED = "submitted",
}

export class TravelAuthorization extends Model<
  InferAttributes<TravelAuthorization>,
  InferCreationAttributes<TravelAuthorization>
> {
  static Statuses = Statuses

  declare id: CreationOptional<number>
  declare slug: string
  declare userId: ForeignKey<User["id"]>
  declare preappId: ForeignKey<Preapproved["preTID"]> | null
  declare purposeId: ForeignKey<TravelPurpose["id"]> | null
  declare firstName: string | null
  declare lastName: string | null
  declare department: string | null
  declare division: string | null
  declare branch: string | null
  declare unit: string | null
  declare email: string | null
  declare mailcode: string | null
  declare daysOffTravelStatus: number | null
  declare dateBackToWork: Date | null
  declare travelDuration: number | null
  declare travelAdvance: number | null
  declare eventName: string | null
  declare summary: string | null
  declare benefits: string | null
  declare status: Statuses | null
  // TODO: consider making this supervisorId?
  declare supervisorEmail: string | null
  declare approved: string | null
  declare requestChange: string | null
  declare denialReason: string | null
  declare oneWayTrip: boolean | null
  declare multiStop: boolean | null
  declare createdBy: number | null
  declare travelAdvanceInCents: number | null
  declare allTravelWithinTerritory: boolean | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  // Associations
  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getPurpose: BelongsToGetAssociationMixin<TravelPurpose>
  declare setPurpose: BelongsToSetAssociationMixin<TravelPurpose, TravelPurpose["id"]>
  declare createPurpose: BelongsToCreateAssociationMixin<TravelPurpose>

  declare getTravelDeskTravelRequest: BelongsToGetAssociationMixin<TravelDeskTravelRequest>
  declare setTravelDeskTravelRequest: BelongsToSetAssociationMixin<
    TravelDeskTravelRequest,
    TravelDeskTravelRequest["travelAuthorizationId"]
  >
  declare createTravelDeskTravelRequest: BelongsToCreateAssociationMixin<TravelDeskTravelRequest>

  declare getExpenses: HasManyGetAssociationsMixin<Expense>
  declare setExpenses: HasManySetAssociationsMixin<Expense, Expense["travelAuthorizationId"]>
  declare hasExpense: HasManyHasAssociationMixin<Expense, Expense["travelAuthorizationId"]>
  declare hasExpenses: HasManyHasAssociationsMixin<Expense, Expense["travelAuthorizationId"]>
  declare addExpense: HasManyAddAssociationMixin<Expense, Expense["travelAuthorizationId"]>
  declare addExpenses: HasManyAddAssociationsMixin<Expense, Expense["travelAuthorizationId"]>
  declare removeExpense: HasManyRemoveAssociationMixin<Expense, Expense["travelAuthorizationId"]>
  declare removeExpenses: HasManyRemoveAssociationsMixin<Expense, Expense["travelAuthorizationId"]>
  declare countExpenses: HasManyCountAssociationsMixin
  declare createExpense: HasManyCreateAssociationMixin<Expense>

  declare getStops: HasManyGetAssociationsMixin<Stop>
  declare setStops: HasManySetAssociationsMixin<Stop, Stop["travelAuthorizationId"]>
  declare hasStop: HasManyHasAssociationMixin<Stop, Stop["travelAuthorizationId"]>
  declare hasStops: HasManyHasAssociationsMixin<Stop, Stop["travelAuthorizationId"]>
  declare addStop: HasManyAddAssociationMixin<Stop, Stop["travelAuthorizationId"]>
  declare addStops: HasManyAddAssociationsMixin<Stop, Stop["travelAuthorizationId"]>
  declare removeStop: HasManyRemoveAssociationMixin<Stop, Stop["travelAuthorizationId"]>
  declare removeStops: HasManyRemoveAssociationsMixin<Stop, Stop["travelAuthorizationId"]>
  declare countStops: HasManyCountAssociationsMixin
  declare createStop: HasManyCreateAssociationMixin<Stop>

  declare purpose?: NonAttribute<TravelPurpose>
  declare travelDeskTravelRequest?: NonAttribute<TravelDeskTravelRequest>
  declare expenses?: NonAttribute<Expense[]>
  declare stops?: NonAttribute<Stop[]>

  declare static associations: {
    expenses: Association<TravelAuthorization, Expense>
    purpose: Association<TravelAuthorization, TravelPurpose>
    stops: Association<TravelAuthorization, Stop>
    travelDeskTravelRequest: Association<TravelAuthorization, TravelDeskTravelRequest>
  }

  static establishAssociations() {
    this.belongsTo(TravelPurpose, {
      as: "purpose",
      foreignKey: "purposeId",
    })
    this.hasOne(TravelDeskTravelRequest, {
      as: "travelDeskTravelRequest",
      sourceKey: "id",
      foreignKey: "travelAuthorizationId",
    })
    this.hasMany(Stop, {
      as: "stops",
      sourceKey: "id",
      foreignKey: "travelAuthorizationId",
    })
    this.hasMany(Expense, {
      as: "expenses",
      sourceKey: "id",
      foreignKey: "travelAuthorizationId",
    })
  }

  get estimates(): NonAttribute<Expense[] | undefined> {
    return this.expenses?.filter((expense) => expense.type === Expense.Types.ESTIMATE)
  }
}

TravelAuthorization.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    preappId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    purposeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "travelPurpose", // using real table name here
        key: "id", // using real column name here
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // using real table name here
        key: "id", // using real column name here
      },
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    branch: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      set(value: string | null) {
        if (typeof value === "string") {
          this.setDataValue("email", value.toLowerCase())
        } else {
          this.setDataValue("email", null)
        }
      },
    },
    mailcode: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    daysOffTravelStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dateBackToWork: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    travelDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    travelAdvance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    eventName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    summary: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    benefits: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isIn: {
          args: [Object.values(Statuses)],
          msg: "Invalid status value",
        },
      },
    },
    supervisorEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      set(value: string | null) {
        if (typeof value === "string") {
          this.setDataValue("supervisorEmail", value.toLowerCase())
        } else {
          this.setDataValue("supervisorEmail", null)
        }
      },
    },
    approved: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    requestChange: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    denialReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // TODO: set default to false in the database
    oneWayTrip: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    // TODO: set default to false in the database
    multiStop: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    // TODO: make this a foreign key to the users table
    // also non-nullable,
    // maybe rename to creatorId
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    travelAdvanceInCents: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    allTravelWithinTerritory: {
      type: DataTypes.BOOLEAN,
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
  },
  {
    sequelize,
    tableName: "travel_authorizations",
    modelName: "TravelAuthorization",
  }
)

export default TravelAuthorization
