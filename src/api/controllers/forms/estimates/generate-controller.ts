import BaseController from "../../base-controller";

export class GenerateController extends BaseController {
  create() {
    return this.response.status(201).json({
      message: "TODO: generate estimates"
    })
  }
}

export default GenerateController
