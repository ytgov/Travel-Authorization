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

import TravelAuthorization from "@/models/travel-authorization"
import TravelAuthorizationPreApprovalSubmission from "@/models/travel-authorization-pre-approval-submission"
import TravelAuthorizationPreApprovalTraveler from "@/models/travel-authorization-pre-approval-traveler"

export class TravelAuthorizationPreApproval extends Model<
  InferAttributes<TravelAuthorizationPreApproval>,
  InferCreationAttributes<TravelAuthorizationPreApproval>
> {
  declare id: CreationOptional<number>
  declare submissionId: ForeignKey<TravelAuthorizationPreApprovalSubmission["preTSubID"] | null>
  declare estimatedCost: number
  declare location: string
  declare department: CreationOptional<string | null>
  declare branch: CreationOptional<string | null>
  declare purpose: CreationOptional<string | null>
  declare reason: CreationOptional<string | null>
  declare startDate: CreationOptional<Date | null>
  declare endDate: CreationOptional<Date | null>
  declare isOpenForAnyDate: CreationOptional<boolean>
  declare month: CreationOptional<string | null>
  declare isOpenForAnyTraveler: CreationOptional<boolean>
  declare numberTravelers: CreationOptional<number | null>
  declare travelerNotes: CreationOptional<string | null>
  declare status: CreationOptional<string | null>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare deletedAt: CreationOptional<Date | null>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getSubmission: BelongsToGetAssociationMixin<TravelAuthorizationPreApprovalSubmission>
  declare setSubmission: BelongsToSetAssociationMixin<
    TravelAuthorizationPreApprovalSubmission,
    TravelAuthorizationPreApprovalSubmission["preTSubID"]
  >
  declare createSubmission: BelongsToCreateAssociationMixin<TravelAuthorizationPreApprovalSubmission>

  declare getTravelAuthorizations: HasManyGetAssociationsMixin<TravelAuthorization>
  declare setTravelAuthorizations: HasManySetAssociationsMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalId"]
  >
  declare hasTravelAuthorization: HasManyHasAssociationMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalId"]
  >
  declare hasTravelAuthorizations: HasManyHasAssociationsMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalId"]
  >
  declare addTravelAuthorization: HasManyAddAssociationMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalId"]
  >
  declare addTravelAuthorizations: HasManyAddAssociationsMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalId"]
  >
  declare removeTravelAuthorization: HasManyRemoveAssociationMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalId"]
  >
  declare removeTravelAuthorizations: HasManyRemoveAssociationsMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalId"]
  >
  declare countTravelAuthorizations: HasManyCountAssociationsMixin
  declare createTravelAuthorization: HasManyCreateAssociationMixin<TravelAuthorizationPreApprovalTraveler>

  declare getTravelers: HasManyGetAssociationsMixin<TravelAuthorizationPreApprovalTraveler>
  declare setTravelers: HasManySetAssociationsMixin<
    TravelAuthorizationPreApprovalTraveler,
    TravelAuthorizationPreApprovalTraveler["travelerID"]
  >
  declare hasTraveler: HasManyHasAssociationMixin<
    TravelAuthorizationPreApprovalTraveler,
    TravelAuthorizationPreApprovalTraveler["travelerID"]
  >
  declare hasTravelers: HasManyHasAssociationsMixin<
    TravelAuthorizationPreApprovalTraveler,
    TravelAuthorizationPreApprovalTraveler["travelerID"]
  >
  declare addTraveler: HasManyAddAssociationMixin<
    TravelAuthorizationPreApprovalTraveler,
    TravelAuthorizationPreApprovalTraveler["travelerID"]
  >
  declare addTravelers: HasManyAddAssociationsMixin<
    TravelAuthorizationPreApprovalTraveler,
    TravelAuthorizationPreApprovalTraveler["travelerID"]
  >
  declare removeTraveler: HasManyRemoveAssociationMixin<
    TravelAuthorizationPreApprovalTraveler,
    TravelAuthorizationPreApprovalTraveler["travelerID"]
  >
  declare removeTravelers: HasManyRemoveAssociationsMixin<
    TravelAuthorizationPreApprovalTraveler,
    TravelAuthorizationPreApprovalTraveler["travelerID"]
  >
  declare countTravelers: HasManyCountAssociationsMixin
  declare createTraveler: HasManyCreateAssociationMixin<TravelAuthorizationPreApprovalTraveler>

  declare submission?: NonAttribute<TravelAuthorizationPreApprovalSubmission>
  declare travelAuthorizations?: NonAttribute<TravelAuthorization[]>
  declare travelers?: NonAttribute<TravelAuthorizationPreApprovalTraveler[]>

  declare static associations: {
    submission: Association<
      TravelAuthorizationPreApproval,
      TravelAuthorizationPreApprovalSubmission
    >
    travelAuthorizations: Association<TravelAuthorizationPreApproval, TravelAuthorization>
    travelers: Association<TravelAuthorizationPreApproval, TravelAuthorizationPreApprovalTraveler>
  }

  static establishAssociations() {
    this.belongsTo(TravelAuthorizationPreApprovalSubmission, {
      as: "submission",
      foreignKey: "submissionId",
    })
    this.hasMany(TravelAuthorization, {
      as: "travelAuthorizations",
      foreignKey: "preApprovalId",
    })
    this.hasMany(TravelAuthorizationPreApprovalTraveler, {
      as: "travelers",
      foreignKey: "preApprovalId",
    })
  }
}

TravelAuthorizationPreApproval.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    submissionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TravelAuthorizationPreApprovalSubmission,
        key: "preTSubID",
      },
    },
    estimatedCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    branch: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isOpenForAnyDate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    month: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isOpenForAnyTraveler: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    numberTravelers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    travelerNotes: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    paranoid: true, // TODO: make this the default
  }
)

export default TravelAuthorizationPreApproval
