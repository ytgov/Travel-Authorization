import { isEmpty, isNil, isUndefined } from "lodash"
import { Attributes } from "sequelize"

import logger from "@/utils/logger"
import { yukonGovernmentIntegration } from "@/integrations"
import db, {
  TravelAuthorization,
  TravelAuthorizationActionLog,
  TravelDeskTravelRequest,
  TravelPurpose,
  TravelSegment,
  User,
} from "@/models"

import BaseService from "@/services/base-service"

export class ApproveService extends BaseService {
  private travelAuthorization: TravelAuthorization
  private approver: User

  constructor(travelAuthorization: TravelAuthorization, approver: User) {
    super()
    this.travelAuthorization = travelAuthorization
    this.approver = approver
  }

  async perform(): Promise<TravelAuthorization> {
    if (this.travelAuthorization.status !== TravelAuthorization.Statuses.SUBMITTED) {
      throw new Error("Travel authorization must be in submitted state to approve.")
    }

    const { travelSegments, user, purpose } = this.travelAuthorization
    if (isUndefined(travelSegments)) {
      throw new Error("Travel authorization expected to have travel segments association.")
    }

    if (isUndefined(user)) {
      throw new Error("Travel authorization expected to have user association.")
    }

    if (isUndefined(purpose)) {
      throw new Error("Travel authorization expected to have purpose association.")
    }

    await db.transaction(async () => {
      await this.travelAuthorization.update({
        status: TravelAuthorization.Statuses.APPROVED,
      })

      if (this.isTravelingByAir(travelSegments)) {
        const travelerDetails = await this.getTravelerDetails(user.email)
        await this.createTravelDeskTravelRequest(user, purpose, travelerDetails)
      }

      await TravelAuthorizationActionLog.create({
        travelAuthorizationId: this.travelAuthorization.id,
        actorId: this.approver.id,
        assigneeId: this.travelAuthorization.userId,
        action: TravelAuthorizationActionLog.Actions.APPROVED,
      })
    })

    return this.travelAuthorization.reload({ include: ["expenses", "stops", "purpose", "user"] })
  }

  private isTravelingByAir(travelSegments: TravelSegment[]): boolean {
    return travelSegments.some(
      (segment) => segment.modeOfTransport === TravelSegment.TravelMethods.AIRCRAFT
    )
  }

  private async createTravelDeskTravelRequest(
    user: User,
    purpose: TravelPurpose,
    travelerDetails: Partial<Attributes<TravelDeskTravelRequest>>
  ): Promise<TravelDeskTravelRequest> {
    const { firstName, lastName, email } = user
    if (isNil(firstName)) {
      throw new Error("User expected to have first name.")
    }

    if (isNil(lastName)) {
      throw new Error("User expected to have last name.")
    }

    return TravelDeskTravelRequest.create({
      travelAuthorizationId: this.travelAuthorization.id,
      legalFirstName: firstName,
      legalLastName: lastName,
      strAddress: "",
      city: "",
      province: "",
      postalCode: "",
      busPhone: "",
      busEmail: "",
      ...travelerDetails,
      travelPurpose: purpose.purpose,
      status: TravelDeskTravelRequest.Statuses.DRAFT,
    })
  }

  private async getTravelerDetails(
    email: string
  ): Promise<Partial<Attributes<TravelDeskTravelRequest>>> {
    try {
      const employee = await yukonGovernmentIntegration.fetchEmployee(email)
      if (isNil(employee)) {
        logger.debug(`Failed to find employee info for email: ${email}`)
        return {}
      }

      const province = employee.community?.toLowerCase() == "whitehorse" ? "Yukon" : ""
      const travelContact =
        isNil(employee.mobile) ||
        isEmpty(employee.mobile) ||
        isNil(employee.email) ||
        isEmpty(employee.email)
          ? false
          : true
      const travelPhone = travelContact === true ? employee.mobile : null
      const travelEmail = travelContact === true ? email : null

      return {
        legalFirstName: employee.first_name,
        legalLastName: employee.last_name,
        strAddress: employee.address,
        city: employee.community,
        province,
        postalCode: employee.postal_code,
        busPhone: employee.phone_office,
        busEmail: employee.email,
        travelContact,
        travelPhone,
        travelEmail,
      }
    } catch (error) {
      logger.error(`Failed to retrieve employee info: ${error}`)
      return {}
    }
  }
}

export default ApproveService
