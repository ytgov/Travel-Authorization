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

import TravelAuthorizationPreApproval from "@/models/travel-authorization-pre-approval"

export class TravelAuthorizationPreApprovalTraveler extends Model<
  InferAttributes<TravelAuthorizationPreApprovalTraveler>,
  InferCreationAttributes<TravelAuthorizationPreApprovalTraveler>
> {
  declare travelerID: CreationOptional<number> // Primary key
  declare preApprovalId: ForeignKey<TravelAuthorizationPreApproval["id"]>
  declare fullName: string
  declare department: string
  declare branch: CreationOptional<string | null>

  // Associations

  declare getPreApproval: BelongsToGetAssociationMixin<TravelAuthorizationPreApproval>
  declare setPreApproval: BelongsToSetAssociationMixin<
  TravelAuthorizationPreApproval,
  TravelAuthorizationPreApproval["id"]
  >
  declare createPreApproval: BelongsToCreateAssociationMixin<TravelAuthorizationPreApproval>

  preApproval?: NonAttribute<TravelAuthorizationPreApproval>

  declare static associations: {
    preApproval: Association<TravelAuthorizationPreApprovalTraveler, TravelAuthorizationPreApproval>
  }

  static establishAssociations() {
    this.belongsTo(TravelAuthorizationPreApproval, {
      as: "preApproval",
      foreignKey: "preApprovalId",
    })
  }
}

TravelAuthorizationPreApprovalTraveler.init(
  {
    travelerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    preApprovalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TravelAuthorizationPreApproval,
        key: "id",
      },
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "TravelAuthorizationPreApprovalTraveler",
    tableName: "preapprovedTravelers",
    underscored: false,
    timestamps: false,
    paranoid: false,
  }
)

export default TravelAuthorizationPreApprovalTraveler
