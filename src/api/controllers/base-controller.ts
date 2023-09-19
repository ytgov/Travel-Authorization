import { NextFunction, Request, Response } from "express"

// See https://guides.rubyonrails.org/routing.html#crud-verbs-and-actions
export class BaseController {
  protected request: Request
  protected response: Response
  protected next: NextFunction

  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req
    this.response = res
    this.next = next
  }

  static get index() {
    return (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.index()
    }
  }

  // Usage app.post("/api/users", UsersController.create)
  // maps /api/users to UsersController#create()
  static get create() {
    return (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.create()
    }
  }

  index() {
    throw new Error("Not implemented")
  }

  create() {
    throw new Error("Not Implemented")
  }

  // Internal helpers

  // This should have been loaded in the authorization middleware
  // Currently assuming that authorization happens before this controller gets called.
  // Child controllers that are on an non-authorizable route should override this method
  // and return undefined
  get currentUser(): { id: number } {
    return this.request.user
  }

  get params() {
    return this.request.params
  }

  get query() {
    return this.request.query
  }

  get pagination() {
    const page = parseInt(this.query.page?.toString() || "") || 1
    const perPage = parseInt(this.query.perPage?.toString() || "") || 10
    const limit = perPage === -1 ? 1000: perPage // restrict max limit to 1000 for safety
    const offset = (page - 1) * limit
    return {
      page,
      perPage,
      limit,
      offset,
    }
  }
}

export default BaseController
