import { isNil } from "lodash"

import { TravelDeskQuestion, User } from "@/models"

import BaseService from "@/services/base-service"

type Attributes = Partial<TravelDeskQuestion>

export class CreateService extends BaseService {
  constructor(
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<TravelDeskQuestion> {
    const { travelRequestId, requestType, question, ...optionalAttributes } = this.attributes

    if (isNil(travelRequestId)) {
      throw new Error("Travel request ID is required.")
    }

    if (isNil(requestType)) {
      throw new Error("Request type is required.")
    }

    if (isNil(question)) {
      throw new Error("Question is required.")
    }

    return TravelDeskQuestion.create({
      ...optionalAttributes,
      travelRequestId,
      requestType,
      question,
    })
  }
}

export default CreateService
