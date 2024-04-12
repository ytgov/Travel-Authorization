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

import TravelAuthorizationPreApprovalSubmission from "@/models/travel-authorization-pre-approval-submission"

export class TravelAuthorizationPreApprovalDocument extends Model<
  InferAttributes<TravelAuthorizationPreApprovalDocument>,
  InferCreationAttributes<TravelAuthorizationPreApprovalDocument>
> {
  declare preTDocID: CreationOptional<number>
  declare preTSubID: ForeignKey<TravelAuthorizationPreApprovalSubmission["preTSubID"] | null>
  declare approvalDoc: CreationOptional<Buffer | null>

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getSubmission: BelongsToGetAssociationMixin<TravelAuthorizationPreApprovalSubmission>
  declare setSubmission: BelongsToSetAssociationMixin<
    TravelAuthorizationPreApprovalSubmission,
    TravelAuthorizationPreApprovalSubmission["preTSubID"]
  >
  declare createSubmission: BelongsToCreateAssociationMixin<TravelAuthorizationPreApprovalSubmission>

  declare submission?: NonAttribute<TravelAuthorizationPreApprovalSubmission>

  declare static associations: {
    submission: Association<
      TravelAuthorizationPreApprovalDocument,
      TravelAuthorizationPreApprovalSubmission
    >
  }

  static establishAssociations() {
    this.belongsTo(TravelAuthorizationPreApprovalSubmission, {
      foreignKey: "preTSubID",
      as: "submission",
    })
  }
}

TravelAuthorizationPreApprovalDocument.init(
  {
    preTDocID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    preTSubID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TravelAuthorizationPreApprovalSubmission,
        key: "preTSubID",
      },
    },
    approvalDoc: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "TravelAuthorizationPreApprovalDocument",
    tableName: "preapprovedDocuments",
    underscored: false,
    timestamps: false,
    paranoid: false,
  }
)

export default TravelAuthorizationPreApprovalDocument
