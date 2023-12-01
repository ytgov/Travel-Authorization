import { ClaimTypes } from "@/models/per-diem"

/*
Requirements:
1. On the first day of travel:
  1. Where travel starts after 8am the traveler will not receive breakfast.
  2. Where travel starts after 1pm the traveler will not receive breakfast or lunch.
  3. Where travel starts after 7pm the traveler will not receive any per diem.
      > these rules are going to be slightly different when we look at air travel as travelers need to be at the airport 2 hours early but for the estimates this will work as we are not clear on exact travel times
  4. No incidentals can be claimed this day.

4. On the second and subsequent days of travel:
  1. The traveler will receive the full per diem including incidentals.

5. On the last day of travel:
  1. Where travel ends at 10am the traveler will receive only breakfast
  2. Where travel ends at 2pm the traveler will receive breakfast and lunch
  3. Where travel ends at 7pm the traveler will receive breakfast, lunch and supper
  4. Incidental can be claimed this day regardless of arrival time.
*/
type ClaimTypeOptions = { isFirstDay?: boolean; isLastDay?: boolean }

export function determineClaimTypes(
  travelStartAt: Date,
  travelEndAt: Date,
  { isFirstDay = false, isLastDay = false }: ClaimTypeOptions = {}
): ClaimTypes[] {
  if (isFirstDay) {
    return firstDayClaimTypes(travelStartAt)
  } else if (isLastDay) {
    return lastDayClaimTypes(travelEndAt)
  } else {
    // TODO: add incidentals into the dataset??
    return [ClaimTypes.MAXIMUM_DAILY]
  }
}

function firstDayClaimTypes(departureAt: Date): ClaimTypes[] {
  if (departureAt.getHours() < 8 /* 8am */) {
    return [ClaimTypes.BREAKFAST, ClaimTypes.LUNCH, ClaimTypes.DINNER]
  } else if (departureAt.getHours() < 13 /* 1pm */) {
    return [ClaimTypes.LUNCH, ClaimTypes.DINNER]
  } else if (departureAt.getHours() < 19 /* 7pm */) {
    return [ClaimTypes.DINNER]
  } else {
    return []
  }
}

function lastDayClaimTypes(travelEndAt: Date): ClaimTypes[] {
  if (travelEndAt.getHours() < 10 /* 10pm */) {
    return [] // TODO: plus incidentals
  } else if (travelEndAt.getHours() < 14 /* 2pm */) {
    return [ClaimTypes.BREAKFAST] // TODO: plus incidentals
  } else if (travelEndAt.getHours() < 19 /* 7pm */) {
    return [ClaimTypes.BREAKFAST, ClaimTypes.LUNCH] // TODO: plus incidentals
  } else {
    return [ClaimTypes.BREAKFAST, ClaimTypes.LUNCH, ClaimTypes.DINNER] // TODO: plus incidentals
  }
}

export default determineClaimTypes
