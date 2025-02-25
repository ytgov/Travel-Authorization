import { User } from "@/models"
import BaseService from "@/services/base-service"

export class SyncService extends BaseService {
  constructor(protected currentUser: User) {
    super()
  }

  async perform(): Promise<void> {
    // TODO
    return
  }
}

export default SyncService
