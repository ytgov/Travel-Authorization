import { GeneralLedgerCoding, User } from "@/models"
import BaseService from "@/services/base-service"

export class UpdateService extends BaseService {
  private generalLedgerCoding: GeneralLedgerCoding
  private attributes: Partial<GeneralLedgerCoding>
  private currentUser: User

  constructor(
    generalLedgerCoding: GeneralLedgerCoding,
    attributes: Partial<GeneralLedgerCoding>,
    currentUser: User
  ) {
    super()
    this.generalLedgerCoding = generalLedgerCoding
    this.attributes = attributes
    this.currentUser = currentUser
  }

  async perform(): Promise<GeneralLedgerCoding> {
    await this.generalLedgerCoding.update(this.attributes)
    // TODO: log that the current user performed this action

    return this.generalLedgerCoding
  }
}

export default UpdateService
