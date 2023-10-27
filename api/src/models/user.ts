import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"
import { isNil } from "lodash"

import sequelize from "@/db/db-client"

// TODO: normalize these roles to snake_case
// Avoid exporting here, and instead expose via the User model to avoid naming conflicts
enum Roles {
  ADMIN = "admin",
  USER = "user",
  PAT_ADMIN = "pat_admin",
  DEPT_ADMIN = "dept_admin",
  TD_USER = "td_user",
}

// TODO: normalize these status to snake_case
// Avoid exporting here, and instead expose via the User model to avoid naming conflicts
enum Statuses {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

function isRole(role: string): role is Roles {
  return Object.values(Roles).includes(role as Roles)
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  static Roles = Roles
  static Statuses = Statuses

  declare id: CreationOptional<number>
  declare sub: string // Auth0 subject attribute
  declare email: string
  declare status: string
  declare firstName: string | null
  declare lastName: string | null
  declare roles: string[]
  declare department: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare static associations: {}

  static establishAssociations() {}
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    // Auth0 subject attribute
    sub: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: Statuses.INACTIVE,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING(255)),
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidRole(roles: string[] | string) {
          if (isNil(roles)) return
          if (!Array.isArray(roles)) {
            throw new Error("roles must be an array")
          }

          roles.forEach((role: string) => {
            if (isRole(role)) return

            throw new Error(
              `Invalid role: ${role}. Allowed roles are: ${Object.values(Roles).join(", ")}`
            )
          })
        },
      },
    },
    department: {
      type: DataTypes.STRING(255),
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
    modelName: "User",
    tableName: "users",
  }
)

export default User
