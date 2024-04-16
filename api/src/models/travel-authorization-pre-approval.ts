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
import TravelAuthorizationPreApprovalProfile from "@/models/travel-authorization-pre-approval-profile"

/** Keep in sync with web/src/api/travel-authorization-pre-approvals-api.js */
export enum Statuses {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  DECLINED = "declined",
}

export class TravelAuthorizationPreApproval extends Model<
  InferAttributes<TravelAuthorizationPreApproval>,
  InferCreationAttributes<TravelAuthorizationPreApproval>
> {
  static readonly Statuses = Statuses

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

  declare getProfiles: HasManyGetAssociationsMixin<TravelAuthorizationPreApprovalProfile>
  declare setProfiles: HasManySetAssociationsMixin<
    TravelAuthorizationPreApprovalProfile,
    TravelAuthorizationPreApprovalProfile["id"]
  >
  declare hasProfile: HasManyHasAssociationMixin<
    TravelAuthorizationPreApprovalProfile,
    TravelAuthorizationPreApprovalProfile["id"]
  >
  declare hasProfiles: HasManyHasAssociationsMixin<
    TravelAuthorizationPreApprovalProfile,
    TravelAuthorizationPreApprovalProfile["id"]
  >
  declare addProfile: HasManyAddAssociationMixin<
    TravelAuthorizationPreApprovalProfile,
    TravelAuthorizationPreApprovalProfile["id"]
  >
  declare addProfiles: HasManyAddAssociationsMixin<
    TravelAuthorizationPreApprovalProfile,
    TravelAuthorizationPreApprovalProfile["id"]
  >
  declare removeProfile: HasManyRemoveAssociationMixin<
    TravelAuthorizationPreApprovalProfile,
    TravelAuthorizationPreApprovalProfile["id"]
  >
  declare removeProfiles: HasManyRemoveAssociationsMixin<
    TravelAuthorizationPreApprovalProfile,
    TravelAuthorizationPreApprovalProfile["id"]
  >
  declare countProfiles: HasManyCountAssociationsMixin
  declare createProfile: HasManyCreateAssociationMixin<TravelAuthorizationPreApprovalProfile>

  declare submission?: NonAttribute<TravelAuthorizationPreApprovalSubmission>
  declare profiles?: NonAttribute<TravelAuthorizationPreApprovalProfile[]>

  declare static associations: {
    submission: Association<
      TravelAuthorizationPreApproval,
      TravelAuthorizationPreApprovalSubmission
    >
    profiles: Association<TravelAuthorizationPreApproval, TravelAuthorizationPreApprovalProfile>
  }

  static establishAssociations() {
    this.belongsTo(TravelAuthorizationPreApprovalSubmission, {
      as: "submission",
      foreignKey: "submissionId",
    })
    this.hasMany(TravelAuthorizationPreApprovalProfile, {
      as: "profiles",
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
      validate: {
        isIn: {
          args: [Object.values(Statuses)],
          msg: "Invalid status value",
        },
      },
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
