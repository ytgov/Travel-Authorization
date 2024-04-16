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
import TravelAuthorizationPreApproval from "@/models/travel-authorization-pre-approval"

export class TravelAuthorizationPreApprovalProfile extends Model<
  InferAttributes<TravelAuthorizationPreApprovalProfile>,
  InferCreationAttributes<TravelAuthorizationPreApprovalProfile>
> {
  declare id: CreationOptional<number>
  declare preApprovalId: ForeignKey<TravelAuthorizationPreApproval["id"]>
  declare profileName: string
  declare department: string
  declare branch: CreationOptional<string | null>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare deletedAt: CreationOptional<Date | null>

  // Associations
  declare getPreApproval: BelongsToGetAssociationMixin<TravelAuthorizationPreApproval>
  declare setPreApproval: BelongsToSetAssociationMixin<
    TravelAuthorizationPreApproval,
    TravelAuthorizationPreApproval["id"]
  >
  declare createPreApproval: BelongsToCreateAssociationMixin<TravelAuthorizationPreApproval>

  declare getTravelAuthorizations: HasManyGetAssociationsMixin<TravelAuthorization>
  declare setTravelAuthorizations: HasManySetAssociationsMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalProfileId"]
  >
  declare hasTravelAuthorization: HasManyHasAssociationMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalProfileId"]
  >
  declare hasTravelAuthorizations: HasManyHasAssociationsMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalProfileId"]
  >
  declare addTravelAuthorization: HasManyAddAssociationMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalProfileId"]
  >
  declare addTravelAuthorizations: HasManyAddAssociationsMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalProfileId"]
  >
  declare removeTravelAuthorization: HasManyRemoveAssociationMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalProfileId"]
  >
  declare removeTravelAuthorizations: HasManyRemoveAssociationsMixin<
    TravelAuthorization,
    TravelAuthorization["preApprovalProfileId"]
  >
  declare countTravelAuthorizations: HasManyCountAssociationsMixin
  declare createTravelAuthorization: HasManyCreateAssociationMixin<TravelAuthorizationPreApprovalProfile>

  preApproval?: NonAttribute<TravelAuthorizationPreApproval>
  travelAuthorizations?: NonAttribute<TravelAuthorization[]>

  declare static associations: {
    preApproval: Association<TravelAuthorizationPreApprovalProfile, TravelAuthorizationPreApproval>
    travelAuthorizations: Association<TravelAuthorizationPreApprovalProfile, TravelAuthorization>
  }

  static establishAssociations() {
    this.belongsTo(TravelAuthorizationPreApproval, {
      as: "preApproval",
      foreignKey: "preApprovalId",
    })
    this.hasMany(TravelAuthorization, {
      as: "travelAuthorizations",
      foreignKey: "preApprovalProfileId",
    })
  }
}

TravelAuthorizationPreApprovalProfile.init(
  {
    id: {
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
    profileName: {
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

export default TravelAuthorizationPreApprovalProfile
