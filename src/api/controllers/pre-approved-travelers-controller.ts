import BaseController from "./base-controller"

import { PreapprovedTraveler } from "../models"

export class PreApprovedTravelersController extends BaseController {
  index() {
    const where = this.query.where
    return PreapprovedTraveler.findAll({ where, include: ['preApprovedRequest'] }).then((preApprovedTravelers) => {
      return this.response.json({ preApprovedTravelers })
    })
  }
}

export default PreApprovedTravelersController
