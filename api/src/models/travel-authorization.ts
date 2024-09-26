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

import Expense from "@/models/expense"
import TravelAuthorizationPreApprovalProfile from "@/models/travel-authorization-pre-approval-profile"
import Stop from "@/models/stop"
import TravelDeskTravelRequest from "@/models/travel-desk-travel-request"
import TravelPurpose from "@/models/travel-purpose"
import TravelSegment from "@/models/travel-segment"
import User from "@/models/user"

// TODO: state management is going to be a bit deal for this project
// we should do some aggressive data modeling an engineering before this becomes unmagable
// Statuses are sorted by presumed order of progression
export enum Statuses {
  // TODO: might want replace DELETED status with `deleted_at` field from Sequelize paranoid feature.
  // See https://sequelize.org/docs/v6/core-concepts/paranoid/
  DRAFT = "draft",
  SUBMITTED = "submitted",
  CHANGE_REQUESTED = "change_requested",
  APPROVED = "approved",
  BOOKED = "booked",
  DENIED = "denied",
  EXPENSE_CLAIM_SUBMITTED = "expense_claim_submitted",
  EXPENSE_CLAIM_APPROVED = "expense_claim_approved",
  EXPENSE_CLAIM_DENIED = "expense_claim_denied",
  EXPENSED = "expensed",
  AWAITING_DIRECTOR_APPROVAL = "awaiting_director_approval",
  DELETED = "deleted",
}

export enum TripTypes {
  ROUND_TRIP = "round_trip",
  ONE_WAY = "one_way",
  MULTI_DESTINATION = "multi_destination",
}

export class TravelAuthorization extends Model<
  InferAttributes<TravelAuthorization>,
  InferCreationAttributes<TravelAuthorization>
> {
  static Statuses = Statuses
  static TripTypes = TripTypes

  declare id: CreationOptional<number>
  declare slug: string
  declare userId: ForeignKey<User["id"]>
  declare preApprovalProfileId: ForeignKey<TravelAuthorizationPreApprovalProfile["id"]> | null
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
  declare getPreApprovalProfile: BelongsToGetAssociationMixin<TravelAuthorizationPreApprovalProfile>
  declare setPreApprovalProfile: BelongsToSetAssociationMixin<
    TravelAuthorizationPreApprovalProfile,
    TravelAuthorizationPreApprovalProfile["id"]
  >
  declare createPreApprovalProfile: BelongsToCreateAssociationMixin<TravelAuthorizationPreApprovalProfile>

  declare getPurpose: BelongsToGetAssociationMixin<TravelPurpose>
  declare setPurpose: BelongsToSetAssociationMixin<TravelPurpose, TravelPurpose["id"]>
  declare createPurpose: BelongsToCreateAssociationMixin<TravelPurpose>

  declare getTravelDeskTravelRequest: BelongsToGetAssociationMixin<TravelDeskTravelRequest>
  declare setTravelDeskTravelRequest: BelongsToSetAssociationMixin<
    TravelDeskTravelRequest,
    TravelDeskTravelRequest["travelAuthorizationId"]
  >
  declare createTravelDeskTravelRequest: BelongsToCreateAssociationMixin<TravelDeskTravelRequest>

  declare getUser: BelongsToGetAssociationMixin<User>
  declare setUser: BelongsToSetAssociationMixin<User, User["id"]>
  declare createUser: BelongsToCreateAssociationMixin<User>

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

  declare getTravelSegments: HasManyGetAssociationsMixin<TravelSegment>
  declare setTravelSegments: HasManySetAssociationsMixin<
    TravelSegment,
    TravelSegment["travelAuthorizationId"]
  >
  declare hasTravelSegment: HasManyHasAssociationMixin<
    TravelSegment,
    TravelSegment["travelAuthorizationId"]
  >
  declare hasTravelSegments: HasManyHasAssociationsMixin<
    TravelSegment,
    TravelSegment["travelAuthorizationId"]
  >
  declare addTravelSegment: HasManyAddAssociationMixin<
    TravelSegment,
    TravelSegment["travelAuthorizationId"]
  >
  declare addTravelSegments: HasManyAddAssociationsMixin<
    TravelSegment,
    TravelSegment["travelAuthorizationId"]
  >
  declare removeTravelSegment: HasManyRemoveAssociationMixin<
    TravelSegment,
    TravelSegment["travelAuthorizationId"]
  >
  declare removeTravelSegments: HasManyRemoveAssociationsMixin<
    TravelSegment,
    TravelSegment["travelAuthorizationId"]
  >
  declare countTravelSegments: HasManyCountAssociationsMixin
  declare createTravelSegment: HasManyCreateAssociationMixin<TravelSegment>

  declare preApprovalProfile?: NonAttribute<TravelAuthorizationPreApprovalProfile>
  declare purpose?: NonAttribute<TravelPurpose>
  declare travelDeskTravelRequest?: NonAttribute<TravelDeskTravelRequest>
  declare user?: NonAttribute<User>
  declare expenses?: NonAttribute<Expense[]>
  declare stops?: NonAttribute<Stop[]>
  declare travelSegments?: NonAttribute<TravelSegment[]>

  declare static associations: {
    expenses: Association<TravelAuthorization, Expense>
    preApprovalProfile: Association<TravelAuthorization, TravelAuthorizationPreApprovalProfile>
    purpose: Association<TravelAuthorization, TravelPurpose>
    stops: Association<TravelAuthorization, Stop>
    travelDeskTravelRequest: Association<TravelAuthorization, TravelDeskTravelRequest>
    travelSegments: Association<TravelAuthorization, TravelSegment>
    user: Association<TravelAuthorization, User>
  }

  static establishAssociations() {
    this.belongsTo(TravelAuthorizationPreApprovalProfile, {
      as: "preApprovalProfile",
      foreignKey: "preApprovalProfileId",
    })
    this.belongsTo(TravelPurpose, {
      as: "purpose",
      foreignKey: "purposeId",
    })
    this.belongsTo(User, {
      as: "user",
      foreignKey: "userId",
    })
    this.hasOne(TravelDeskTravelRequest, {
      as: "travelDeskTravelRequest",
      sourceKey: "id",
      foreignKey: "travelAuthorizationId",
    })
    this.hasMany(Expense, {
      as: "expenses",
      sourceKey: "id",
      foreignKey: "travelAuthorizationId",
    })
    this.hasMany(Stop, {
      as: "stops",
      sourceKey: "id",
      foreignKey: "travelAuthorizationId",
    })
    this.hasMany(TravelSegment, {
      as: "travelSegments",
      sourceKey: "id",
      foreignKey: "travelAuthorizationId",
    })
  }

  // Shim until Stop model is fully removed
  buildTravelSegmentsFromStops(): TravelSegment[] {
    if (this.stops === undefined || this.stops.length < 2) {
      throw new Error("Must have at least 2 stops to build a travel segments")
    }

    if (this.multiStop === true && this.stops.length < 4) {
      throw new Error("Must have at least 4 stops to build a multi-stop travel segments")
    }

    const isRoundTrip = this.oneWayTrip !== true && this.multiStop !== true
    if (isRoundTrip) {
      return this.stops.reduce((travelSegments: TravelSegment[], stop, index, stops) => {
        const isLastStop = index === stops.length - 1
        const arrivalStop = isLastStop ? stops[0] : stops[index + 1]

        const travelSegment = TravelSegment.buildFromStops({
          travelAuthorizationId: this.id,
          departureStop: stop,
          arrivalStop,
          segmentNumber: index,
        })
        travelSegments.push(travelSegment)
        return travelSegments
      }, [])
    }

    return this.stops.reduce((travelSegments: TravelSegment[], stop, index, stops) => {
      const isLastStop = index === stops.length - 1
      if (isLastStop) return travelSegments

      const travelSegment = TravelSegment.buildFromStops({
        travelAuthorizationId: this.id,
        departureStop: stop,
        arrivalStop: stops[index + 1],
        segmentNumber: index,
      })
      travelSegments.push(travelSegment)
      return travelSegments
    }, [])
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
    preApprovalProfileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TravelAuthorizationPreApprovalProfile,
        key: "id",
      },
    },
    purposeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TravelPurpose,
        key: "id",
      },
    },
    // TODO: consider renaming this to requestorId?
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
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
    requestChange: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    denialReason: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    // TODO: replace with string enum field using TripTypes
    // TODO: set default to false in the database
    oneWayTrip: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    // TODO: replace with string enum field using TripTypes
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
    paranoid: false,
    validate: {
      tripTypeConsistency() {
        if (this.oneWayTrip === true && this.multiStop === true) {
          throw new Error("oneWayTrip and multiStop cannot both be true")
        }
      },
    },
  }
)

export default TravelAuthorization
