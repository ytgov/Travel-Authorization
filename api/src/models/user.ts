import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import sequelize from "@/db/db-client"

// Avoid exporting here, and instead expose via the User model to avoid naming conflicts
enum Roles {
  ADMIN = "Admin",
  USER = "User",
  PAT_ADMIN = "PatAdmin",
  DEPT_ADMIN = "DeptAdmin",
  TD_USER = "TdUser",
}

// Avoid exporting here, and instead expose via the User model to avoid naming conflicts
enum Statuses {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  static Roles = Roles
  static Statuses = Statuses

  declare id: CreationOptional<number>
  declare sub: string
  declare email: string
  declare status: string
  declare firstName: string | null
  declare lastName: string | null
  declare roles: string | null
  declare department: string | null
  declare createDate: CreationOptional<Date>

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
    // TODO: consider making this a string array or jsonb column
    roles: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      validate: {
        isValidRole(value: string) {
          if (!value) return

          const roleArray = value.split(",").map((role) => role.trim())
          roleArray.forEach((role: string) => {
            if (Object.values(Roles).includes(role as any)) return

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
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // TODO: standardize this model, make table name plural and standardize timestamps column names
    sequelize,
    modelName: "User",
    tableName: "user",
    createdAt: "createDate",
    updatedAt: false,
  }
)

export default User
