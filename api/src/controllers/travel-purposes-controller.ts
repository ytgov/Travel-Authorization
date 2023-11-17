import BaseController from "./base-controller"

import { TravelPurpose } from "@/models"

export class TravelPurposesController extends BaseController {
  index() {
    return TravelPurpose.findAll().then((travelPurposes) => {
      return this.response.json({ travelPurposes })
    })
  }
}
