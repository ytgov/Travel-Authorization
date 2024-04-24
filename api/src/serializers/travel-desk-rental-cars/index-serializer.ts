import { isNil, pick } from "lodash"

import { TravelDeskRentalCar, User } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"

export type TravelDeskRentalCarTableView = Pick<
  TravelDeskRentalCar,
  | "id"
  | "travelRequestId"
  | "pickUpCity"
  | "pickUpLocation"
  | "pickUpLocationOther"
  | "dropOffCity"
  | "dropOffLocation"
  | "dropOffLocationOther"
  | "sameDropOffLocation"
  | "matchFlightTimes"
  | "vehicleTypeChangeIndicator"
  | "vehicleType"
  | "vehicleChangeRationale"
  | "pickUpDate"
  | "dropOffDate"
  | "additionalNotes"
  | "status"
  | "reservedVehicleInfo"
  | "booking"
  | "createdAt"
  | "updatedAt"
>

export class IndexSerializer extends BaseSerializer<TravelDeskRentalCar> {
  constructor(protected record: TravelDeskRentalCar, protected currentUser: User) {
    super(record)
  }

  perform(): TravelDeskRentalCarTableView {
    return {
      ...pick(this.record.dataValues, [
        "id",
        "travelRequestId",
        "pickUpCity",
        "pickUpLocation",
        "pickUpLocationOther",
        "dropOffCity",
        "dropOffLocation",
        "dropOffLocationOther",
        "sameDropOffLocation",
        "matchFlightTimes",
        "vehicleTypeChangeIndicator",
        "vehicleType",
        "vehicleChangeRationale",
        "additionalNotes",
        "status",
        "reservedVehicleInfo",
        "booking",
      ]),
      pickUpDate: new Date(this.record.pickUpDate),
      dropOffDate: new Date(this.record.dropOffDate),
      createdAt: new Date(this.record.createdAt),
      updatedAt: new Date(this.record.updatedAt),
    }
  }
}

export default IndexSerializer
