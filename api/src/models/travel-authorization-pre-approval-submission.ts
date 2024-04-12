import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

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

  // TODO: add associations
  static establishAssociations() {}
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
