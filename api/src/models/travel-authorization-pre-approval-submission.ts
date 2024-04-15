import {
  Association,
  CreationOptional,
  DataTypes,
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
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize"

import sequelize from "@/db/db-client"

import TravelAuthorizationPreApproval from "@/models/travel-authorization-pre-approval"
import TravelAuthorizationPreApprovalDocument from "@/models/travel-authorization-pre-approval-document"

/**
 * Keep in sync with web/src/api/travel-authorization-pre-approval-submissions-api.js
 *
 * TODO: consider if these should be shared with TravelAuthorizationPreApproval
 */
export enum Statuses {
  DRAFT = "draft",
  SUBMITTED = "submitted",
}

export class TravelAuthorizationPreApprovalSubmission extends Model<
  InferAttributes<TravelAuthorizationPreApprovalSubmission>,
  InferCreationAttributes<TravelAuthorizationPreApprovalSubmission>
> {
  declare preTSubID: CreationOptional<number>
  declare submitter: string
  declare status: string
  declare submissionDate: CreationOptional<Date | null>
  declare approvalDate: CreationOptional<Date | null>
  declare approvedBy: CreationOptional<string | null>
  declare department: CreationOptional<string | null>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getPreApproval: HasOneGetAssociationMixin<TravelAuthorizationPreApproval>
  declare setPreApproval: HasOneSetAssociationMixin<
    TravelAuthorizationPreApproval,
    TravelAuthorizationPreApproval["submissionId"]
  >
  declare createPreApproval: HasOneCreateAssociationMixin<TravelAuthorizationPreApproval>

  declare getDocuments: HasManyGetAssociationsMixin<TravelAuthorizationPreApprovalDocument>
  declare setDocuments: HasManySetAssociationsMixin<
    TravelAuthorizationPreApprovalDocument,
    TravelAuthorizationPreApprovalDocument["preTSubID"]
  >
  declare hasDocument: HasManyHasAssociationMixin<
    TravelAuthorizationPreApprovalDocument,
    TravelAuthorizationPreApprovalDocument["preTSubID"]
  >
  declare hasDocuments: HasManyHasAssociationsMixin<
    TravelAuthorizationPreApprovalDocument,
    TravelAuthorizationPreApprovalDocument["preTSubID"]
  >
  declare addDocument: HasManyAddAssociationMixin<
    TravelAuthorizationPreApprovalDocument,
    TravelAuthorizationPreApprovalDocument["preTSubID"]
  >
  declare addDocuments: HasManyAddAssociationsMixin<
    TravelAuthorizationPreApprovalDocument,
    TravelAuthorizationPreApprovalDocument["preTSubID"]
  >
  declare removeDocument: HasManyRemoveAssociationMixin<
    TravelAuthorizationPreApprovalDocument,
    TravelAuthorizationPreApprovalDocument["preTSubID"]
  >
  declare removeDocuments: HasManyRemoveAssociationsMixin<
    TravelAuthorizationPreApprovalDocument,
    TravelAuthorizationPreApprovalDocument["preTSubID"]
  >
  declare countDocuments: HasManyCountAssociationsMixin
  declare createDocument: HasManyCreateAssociationMixin<TravelAuthorizationPreApprovalDocument>

  declare preApproval?: NonAttribute<TravelAuthorizationPreApproval>
  declare documents?: NonAttribute<TravelAuthorizationPreApprovalDocument[]>

  declare static associations: {
    preApproval: Association<
      TravelAuthorizationPreApprovalSubmission,
      TravelAuthorizationPreApproval
    >
    documents: Association<
      TravelAuthorizationPreApprovalSubmission,
      TravelAuthorizationPreApprovalDocument
    >
  }

  static establishAssociations() {
    this.hasOne(TravelAuthorizationPreApproval, {
      sourceKey: "preTSubID",
      foreignKey: "submissionId",
      as: "preApproval",
    })
    this.hasMany(TravelAuthorizationPreApprovalDocument, {
      sourceKey: "preTSubID",
      foreignKey: "preTSubID",
      as: "documents",
    })
  }
}

TravelAuthorizationPreApprovalSubmission.init(
  {
    preTSubID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    submitter: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    submissionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      // TODO: update to use current date
      defaultValue: "2023-12-21",
      // defaultValue: DataTypes.NOW,
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "TravelAuthorizationPreApprovalSubmission",
    tableName: "preapprovedSubmissions",
    underscored: false,
    timestamps: false,
    paranoid: false,
  }
)

export default TravelAuthorizationPreApprovalSubmission
