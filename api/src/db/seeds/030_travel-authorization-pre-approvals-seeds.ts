import { TravelAuthorizationPreApproval } from "@/models"
import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  await TravelAuthorizationPreApproval.destroy({ where: {} })
  await TravelAuthorizationPreApproval.bulkCreate([
    {
      submissionId: null,
      estimatedCost: 1500,
      location: "Whitehorse",
      department: "IT",
      branch: "IT",
      purpose: "Annual Financial Review",
      reason: "Annual departmental meeting to discuss financial strategies and performance",
      startDate: new Date("2024-06-15"),
      endDate: new Date("2024-06-20"),
      isOpenForAnyDate: false,
      month: "June",
      isOpenForAnyTraveler: false,
      numberTravelers: 3,
      travelerNotes: "All travelers are senior finance officers",
      status: "Pending",
    },
    {
      submissionId: null,
      estimatedCost: 800,
      location: "Dawson",
      department: "IT",
      branch: "IT",
      purpose: "Marketing Campaign Launch",
      reason: "Coordination meeting for the upcoming product launch",
      startDate: new Date("2024-07-22"),
      endDate: new Date("2024-07-25"),
      isOpenForAnyDate: false,
      month: "July",
      isOpenForAnyTraveler: true,
      numberTravelers: 2,
      travelerNotes: "Include both a creative director and campaign manager",
      status: "Approved",
    },
    {
      submissionId: null,
      estimatedCost: 1200,
      location: "Watson Lake",
      department: "IT",
      branch: "IT",
      purpose: "Technology Upgrade Planning",
      reason: "Planning session for upcoming software and hardware upgrades",
      startDate: new Date("2024-08-10"),
      endDate: new Date("2024-08-12"),
      isOpenForAnyDate: false,
      month: "August",
      isOpenForAnyTraveler: false,
      numberTravelers: 4,
      travelerNotes: "Includes IT managers and system administrators",
      status: "Reviewing",
    },
  ])
}
