import { isNil } from "lodash"
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

import Destination from "./destination"
import Form from "./form"

const BEGINNING_OF_DAY = "00:00:00"

// Keep in sync with web/src/modules/travelForm/components/TravelMethodSelect.vue
// Until both are using a shared location
export enum TravelMethods {
  AIRCRAFT = "Aircraft",
  POOL_VEHICLE = "Pool Vehicle",
  PERSONAL_VEHICLE = "Personal Vehicle",
  RENTAL_VEHICLE = "Rental Vehicle",
  BUS = "Bus",
  // TODO: replace other type with specific values
  // OTHER = "Other:"
}

// Keep in sync with web/src/modules/travelForm/components/AccommodationTypeSelect.vue
// Until both are using a shared location
export enum AccommodationTypes {
  HOTEL = "Hotel",
  PRIVATE = "Private",
  // TODO: replace other type with specific values
  // OTHER = "Other:",
}

export class Stop extends Model<InferAttributes<Stop>, InferCreationAttributes<Stop>> {
  declare id: CreationOptional<number>
  declare taid: ForeignKey<Form["id"]>
  declare locationId: ForeignKey<Destination["id"]>
  declare departureDate: Date | null
  declare departureTime: string | null
  declare transport: string | null
  declare accommodationType: string | null

  // https://sequelize.org/docs/v6/other-topics/typescript/#usage
  // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
  // https://sequelize.org/api/v7/types/_sequelize_core.index.belongstocreateassociationmixin
  declare getForm: BelongsToGetAssociationMixin<Form>
  declare setForm: BelongsToSetAssociationMixin<Form, Form["id"]>
  declare createForm: BelongsToCreateAssociationMixin<Form>

  declare getLocation: BelongsToGetAssociationMixin<Destination>
  declare setLocation: BelongsToSetAssociationMixin<Destination, Destination["id"]>
  declare createLocation: BelongsToCreateAssociationMixin<Destination>

  declare form?: NonAttribute<Form>
  declare location?: NonAttribute<Destination>

  declare static associations: {
    form: Association<Stop, Form>
    location: Association<Stop, Destination>
  }

  static establishAssociations() {
    this.belongsTo(Destination, {
      as: "location",
      foreignKey: "locationId",
    })
    this.belongsTo(Form, {
      as: "form",
      foreignKey: "taid",
    })
  }

  get departureAt(): NonAttribute<Date | null> {
    const departureDate = this.departureDate
    if (isNil(departureDate)) return null

    const timePart = this.departureTime || BEGINNING_OF_DAY
    const departureDateTime = new Date(`${departureDate}T${timePart}`)
    return departureDateTime
  }
}

Stop.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    taid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "forms", // using table name here, instead of Model class
        key: "id",
      },
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "locationId",
      references: {
        model: "locations", // using table name here, instead of Model class
        key: "id",
      },
    },
    departureDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "departureDate",
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: "departureTime",
    },
    transport: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    accommodationType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "accommodationType",
    },
  },
  {
    sequelize,
    modelName: "Stop",
    tableName: "stops",
    timestamps: false,
  }
)

export default Stop
