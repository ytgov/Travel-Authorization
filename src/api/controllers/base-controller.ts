import { NextFunction, Request, Response } from 'express'

// See https://guides.rubyonrails.org/routing.html#crud-verbs-and-actions
export class BaseController {
  protected request: Request
  protected response: Response
  protected next: NextFunction

  constructor(
    req: Request, res: Response, next: NextFunction
  ) {
    this.request = req
    this.response = res
    this.next = next
  }

  // Usage app.post("/api/users", UsersController.create)
  // maps /api/users to UsersController#create()
  static get create () {
    return (req: Request, res: Response, next: NextFunction) => {
      const controllerInstance = new this(req, res, next)
      return controllerInstance.create()
    }
  }

  create() {
    throw new Error('Not Implemented')
  }
}

export default BaseController;
