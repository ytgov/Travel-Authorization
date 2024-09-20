import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize"

export class TravelDeskTravelAgency extends Model<
  InferAttributes<TravelDeskTravelAgency>,
  InferCreationAttributes<TravelDeskTravelAgency>
> {
  declare id: CreationOptional<number>

  // TODO: add other fields

  // TODO: add associations
}

// TODO: add model initialization

export default TravelDeskTravelAgency
