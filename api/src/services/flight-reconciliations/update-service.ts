import { FlightReconciliation, User } from "@/models"
import BaseService from "@/services/base-service"

type Attributes = Partial<FlightReconciliation>

export class UpdateService extends BaseService {
  constructor(
    protected flightReconciliation: FlightReconciliation,
    protected attributes: Attributes,
    protected currentUser: User
  ) {
    super()
  }

  async perform(): Promise<FlightReconciliation> {
    return this.flightReconciliation.update({
      ...this.attributes,
      reconcilerId: this.currentUser.id,
    })
  }
}

export default UpdateService
