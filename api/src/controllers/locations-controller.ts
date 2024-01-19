import BaseController from "./base-controller"

import { Location } from "@/models"

export class LocationsController extends BaseController {
  // TODO: support pagination and filtering, or replace with external api
  async index() {
    const locations = await Location.findAll()
    return this.response.json({ locations })
  }

  async show() {
    const location = await Location.findByPk(this.params.locationId)
    return this.response.json({ location })
  }
}

export default LocationsController
