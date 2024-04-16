import { Knex } from "knex"

import { TravelAuthorizationPreApproval, TravelAuthorizationPreApprovalProfile } from "@/models"
import { Statuses } from "@/models/travel-authorization-pre-approval"

export async function seed(knex: Knex): Promise<void> {
  await TravelAuthorizationPreApproval.destroy({ where: {} })
  const preApprovals = await TravelAuthorizationPreApproval.bulkCreate([
    {
      submissionId: null,
      estimatedCost: 1500,
      location: "Whitehorse",
      // Department and branch are taken from YgDepartments table.
      // TODO: create relevant records in YgDepartments table.
      department: "Economic Development",
      branch: "Human Resources",
      purpose: "Annual Financial Review",
      reason: "Annual departmental meeting to discuss financial strategies and performance",
      startDate: new Date("2024-06-15"),
      endDate: new Date("2024-06-20"),
      isOpenForAnyDate: true,
      month: "June",
      isOpenForAnyTraveler: false,
      numberTravelers: 3,
      travelerNotes: "All travelers are senior finance officers",
      status: Statuses.DRAFT,
    },
    {
      submissionId: null,
      estimatedCost: 800,
      location: "Dawson",
      department: "Economic Development",
      branch: "Human Resources",
      purpose: "Marketing Campaign Launch",
      reason: "Coordination meeting for the upcoming product launch",
      startDate: new Date("2024-07-22"),
      endDate: new Date("2024-07-25"),
      isOpenForAnyDate: false,
      month: null,
      isOpenForAnyTraveler: true,
      numberTravelers: 2,
      travelerNotes: "Include both a creative director and campaign manager",
      status: Statuses.DRAFT,
    },
    {
      submissionId: null,
      estimatedCost: 1200,
      location: "Watson Lake",
      department: "Economic Development",
      branch: "Human Resources",
      purpose: "Technology Upgrade Planning",
      reason: "Planning session for upcoming software and hardware upgrades",
      startDate: null,
      endDate: null,
      isOpenForAnyDate: true,
      month: "January",
      isOpenForAnyTraveler: true,
      numberTravelers: 4,
      travelerNotes: "Includes IT managers and system administrators",
      status: Statuses.DRAFT,
    },
  ])

  if (preApprovals.length < 3) {
    throw new Error("Need at least 3 pre-approvals to seed pre-approval profiles.")
  }

  await TravelAuthorizationPreApprovalProfile.destroy({ where: {} })
  await TravelAuthorizationPreApprovalProfile.bulkCreate([
    {
      preApprovalId: preApprovals[0].id,
      profileName: "Finance Officers",
      department: "Economic Development",
      branch: "Human Resources",
    },
    {
      preApprovalId: preApprovals[1].id,
      profileName: "Marketing Team",
      department: "Economic Development",
      branch: "Human Resources",
    },
    {
      preApprovalId: preApprovals[2].id,
      profileName: "IT Team",
      department: "Economic Development",
      branch: "Human Resources",
    },
  ])
}
