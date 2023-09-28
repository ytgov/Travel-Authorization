import BaseController from "./base-controller"

import { Preapproved } from "../models"

export class PreApprovedTravelRequestsController extends BaseController {
  index() {
    const where = this.params.where
    return Preapproved.findAll({ where, include: ['preApprovedTravelers'] }).then((preApprovedTravelRequests) => {
      return this.response.json({ preApprovedTravelRequests })
    })
  }
}

export default PreApprovedTravelRequestsController
