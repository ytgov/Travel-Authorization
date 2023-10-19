import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize"

export class TravelDeskTravelAgent extends Model<
  InferAttributes<TravelDeskTravelAgent>,
  InferCreationAttributes<TravelDeskTravelAgent>
> {
  declare agencyID: CreationOptional<number>

  // TODO: add other fields

  // TODO: add associations
}

// TODO: add model initialization

export default TravelDeskTravelAgent
