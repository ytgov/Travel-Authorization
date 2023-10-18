import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize"

export class TravelDeskTravelRequest extends Model<
  InferAttributes<TravelDeskTravelRequest>,
  InferCreationAttributes<TravelDeskTravelRequest>
> {
  declare requestID: CreationOptional<number>

  // TODO: add other fields

  // TODO: add associations
}

// TODO: add model initialization
