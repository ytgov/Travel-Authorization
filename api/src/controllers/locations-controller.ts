import BaseController from "./base-controller"

import { Location } from "@/models"

export class LocationsController extends BaseController {
  // TODO: support pagination and filtering, or replace with external api
  index() {
    return Location.findAll().then((locations) => {
      return this.response.json({ locations })
    })
  }
}
