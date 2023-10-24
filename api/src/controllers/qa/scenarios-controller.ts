import BaseController from "@/controllers/base-controller"

export enum ScenarioTypes {
  MY_TRAVEL_REQUESTS = "/my-travel-requests",
}

export class ScenariosController extends BaseController {
  index() {
    return this.response.status(200).json({
      scenarios: Object.values(ScenarioTypes),
    })
  }
}

export default ScenariosController
