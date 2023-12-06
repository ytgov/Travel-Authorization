import BaseController from "@/controllers/base-controller"

import { ScenarioTypes } from "./scenario-types"

export class ScenariosController extends BaseController {
  async index() {
    return this.response.status(200).json({
      scenarios: Object.values(ScenarioTypes),
    })
  }
}

export default ScenariosController
