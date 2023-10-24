import BaseController from "@/controllers/base-controller"

import { MyTravelRequestsService } from "@/services/qa/scenarios"

export class MyTravelRequestsController extends BaseController {
  async create() {
    return MyTravelRequestsService.perform()
      .then(() => {
        return this.response.status(201).json({ message: "My Travel Rquest Scenario Applied" })
      })
      .catch((error) => {
        return this.response.status(422).json({ message: `Expense creation failed: ${error}` })
      })
  }
}

export default MyTravelRequestsController
