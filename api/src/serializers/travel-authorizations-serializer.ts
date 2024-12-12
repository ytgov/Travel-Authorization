import { TravelAuthorization, User } from "@/models"

import BaseSerializer from "@/serializers/base-serializer"
import StopsSerializer, { StopDetailedView } from "@/serializers/stops-serializer"
import UsersSerializer, { UserDetailedView } from "@/serializers/users-serializer"

export type TravelAuthorizationDetailedView = Omit<
  Partial<TravelAuthorization>,
  "stops" | "user"
> & {
  stops: StopDetailedView[]
  user: UserDetailedView
}

// TODO: re-write this to use newer serializer pattern
export class TravelAuthorizationsSerializer extends BaseSerializer<TravelAuthorization> {
  static asDetailed(record: TravelAuthorization): TravelAuthorizationDetailedView {
    const serializer = new this(record)
    return serializer.asDetailed()
  }

  private user: User

  constructor(record: TravelAuthorization) {
    super(record)

    // TODO: re-write this to use newer serializer pattern
    // and move this to a getter
    if (record.user === undefined) {
      throw new Error("TravelAuthorization must include an associated User")
    }

    this.user = record.user
  }

  asDetailed(): TravelAuthorizationDetailedView {
    return {
      ...this.record.dataValues,
      user: UsersSerializer.asDetailed(this.user),
      stops: this.record.stops?.map(StopsSerializer.asDetailed) || [],
    }
  }
}

export default TravelAuthorizationsSerializer
