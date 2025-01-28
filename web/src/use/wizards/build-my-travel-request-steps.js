import { unref } from "vue"
import { isNil } from "lodash"

/**
 * @typedef {{
 *   id: string;
 *   title: string;
 *   subtitle: string;
 *   component: () => import("*.vue");
 *   continueButtonText?: string;
 *   continueButtonProps?: import("vuetify/lib/VBtn").VBtn;
 *   backButtonText?: string;
 *   backButtonProps?: import("vuetify/lib/VBtn").VBtn;
 *   editable: boolean;
 * }} WizardStep
 */

/**
 * @param {Partial<WizardStep>} options
 * @returns {WizardStep}
 */
export function buildStep(options) {
  if (isNil(options.id)) {
    throw new Error("id is required")
  }

  if (isNil(options.title)) {
    throw new Error("title is required")
  }

  if (isNil(options.subtitle)) {
    throw new Error("subtitle is required")
  }

  // if (isNil(options.component)) {
  //   throw new Error("component is required")
  // }

  return {
    editable: false,
    ...options,
  }
}

/**
 *
 * @param {number | Ref<number>} travelAuthorizationIdMaybeRef
 * @returns {
 *   id: string
 * }
 */
export function buildMyTravelRequestSteps(travelAuthorizationIdMaybeRef) {
  const travelAuthorizationId = unref(travelAuthorizationIdMaybeRef)

  //   {
  //     path: "awaiting-approval",
  //     name: "my-travel-requests/AwaitingApprovalPage",
  //     component: () => import("@/pages/my-travel-requests/AwaitingApprovalPage.vue"),
  //     props: true,
  //   },
  //   {
  //     path: "request",
  //     name: "my-travel-requests/request/RequestPage",
  //     component: () => import("@/pages/my-travel-requests/request/RequestPage.vue"),
  //     props: true,
  //   },
  //   {
  //     path: "request/edit-travel-details",
  //     name: "my-travel-requests/request/RequestEditTravelDetailsPage",
  //     component: () =>
  //       import("@/pages/my-travel-requests/request/RequestEditTravelDetailsPage.vue"),
  //     props: true,
  //   },
  //   {
  //     path: "awaiting-request-options",
  //     name: "my-travel-requests/AwaitingRequestOptionsPage",
  //     component: () =>
  //       import("@/pages/my-travel-requests/AwaitingRequestOptionsPage.vue"),
  //     props: true,
  //   },
  //   {
  //     path: "request/rank-options",
  //     name: "my-travel-requests/request/RequestOptionsProvidedPage",
  //     component: () =>
  //       import("@/pages/my-travel-requests/request/RequestOptionsProvidedPage.vue"),
  //     props: true,
  //   },
  //   {
  //     path: "awaiting-request-booking",
  //     name: "my-travel-requests/AwaitingRequestBookingPage",
  //     component: () =>
  //       import("@/pages/my-travel-requests/AwaitingRequestBookingPage.vue"),
  //     props: true,
  //   },
  //   {
  //     path: "expense",
  //     name: "my-travel-requests/expense/ExpensePage",
  //     component: () => import("@/pages/my-travel-requests/expense/ExpensePage.vue"),
  //     props: true,
  //   },
  //   {
  //     path: "expense/edit",
  //     name: "my-travel-requests/expense/ExpenseEditPage",
  //     component: () => import("@/pages/my-travel-requests/expense/ExpenseEditPage.vue"),
  //     props: true,
  //   },
  //   {
  //     path: "awaiting-travel-start",
  //     name: "my-travel-requests/AwaitingTravelStartPage",
  //     component: () => import("@/pages/my-travel-requests/AwaitingTravelStartPage.vue"),
  //     props: true,
  //   },
  // ]
  return [
    {
      id: "edit-purpose-details",
      title: "Details: purpose",
      subtitle: "Enter trip purpose",
      component: () => import("@/components/my-travel-request-wizard/EditPurposeDetailsStep.vue"),
    },
    {
      id: "edit-trip-details",
      title: "Details: trip",
      subtitle: "Enter trip details",
      component: () => import("@/components/my-travel-request-wizard/EditTripDetailsStep.vue"),
    },
    {
      id: "generate-estimate",
      title: "Estimate: edit",
      subtitle: "Generate estimate",
      component: () => import("@/components/my-travel-request-wizard/GenerateEstimateStep.vue"),
    },
    {
      id: "submit-to-supervisor",
      title: "Details: submit",
      subtitle: "Submit travel request",
      component: () => import("@/components/my-travel-request-wizard/SubmitToSupervisorStep.vue"),
      continueButtonText: "Submit to Supervisor",
    },
    {
      id: "review-trip-details",
      title: "Details",
      subtitle: "Review submitted trip details",
      component: () => import("@/components/my-travel-request-wizard/ReviewTripDetailsStep.vue"),
      backButtonText: "Revert to Draft",
      backButtonProps: {
        color: "warning",
      },
    },
    {
      id: "review-submitted-estimate",
      title: "Estimate",
      subtitle: "Review submitted estimate",
      component: () =>
        import("@/components/my-travel-request-wizard/ReviewSubmittedEstimateStep.vue"),
    },
    {
      id: "awaiting-supervisor-approval",
      title: "Waiting for approval",
      subtitle: "Travel request is submitted to supervisor and waiting for approval.",
      component: () =>
        import("@/components/my-travel-request-wizard/AwaitingSupervisorApprovalStep.vue"),
      continueButtonText: "Check status?",
    },

    {
      id: "edit-travel-desk-travel-request-traveller-details",
      title: "Request: traveller details",
      subtitle: "Enter traveller details",
      to: {
        name: "my-travel-requests/request/RequestEditTravelDetailsPage",
        params: {
          travelAuthorizationId,
        },
      },
    },
    {
      id: "submit-to-travel-desk",
      title: "Request: submit",
      subtitle: "Submit to travel desk",
      component: () => import("@/components/my-travel-request-wizard/SubmitToTravelDeskStep.vue"),
      continueButtonText: "Submit",
    },
    {
      id: "review-travel-desk-travel-request-details",
      title: "Request",
      subtitle: "Review request details",
      to: {
        name: "my-travel-requests/request/RequestPage",
        params: {
          travelAuthorizationId,
        },
      },
      backButtonProps: {
        disabled: true,
      },
    },
    {
      id: "awaiting-flight-options",
      title: "Awaiting flight options",
      subtitle: "Awaiting flight options from travel desk",
      to: {
        name: "my-travel-requests/AwaitingRequestOptionsPage",
        params: {
          travelAuthorizationId,
        },
      },
      continueButtonProps: {
        disabled: true,
      },
    },
    {
      id: "rank-flight-options",
      title: "Rank options",
      subtitle: "Rank options provided",
      to: {
        name: "my-travel-requests/request/RequestOptionsProvidedPage",
        params: {
          travelAuthorizationId,
        },
      },
      continueButtonText: "Submit Option Rankings",
    },
    {
      id: "waiting-for-booking-confirmation",
      title: "Waiting for booking",
      subtitle: "Travel request flight options are ranked, waiting for booking confirmation.",
      to: {
        name: "my-travel-requests/AwaitingRequestBookingPage",
        params: {
          travelAuthorizationId,
        },
      },
      backButtonProps: {
        disabled: true,
      },
      continueButtonProps: {
        disabled: true,
      },
    },
    {
      id: "awaiting-travel-start",
      title: "Awaiting travel start",
      subtitle: "Waiting for travel to start",
      to: {
        name: "my-travel-requests/AwaitingTravelStartPage",
        params: {
          travelAuthorizationId,
        },
      },
      continueButtonProps: {
        disabled: true,
      },
    },
    {
      id: "edit-submit-expenses",
      title: "Expense: edit",
      subtitle: "Submit expenses",
      to: {
        name: "my-travel-requests/expense/ExpenseEditPage",
        params: {
          travelAuthorizationId,
        },
      },
      continueButtonText: "Submit to Supervisor",
    },
    {
      id: "review-expenses",
      title: "Expense",
      subtitle: "Review submitted expense",
      to: {
        name: "my-travel-requests/expense/ExpensePage",
        params: {
          travelAuthorizationId,
        },
      },
      backButtonProps: {
        disabled: true,
      },
    },
  ].map(buildStep)
}

export default buildMyTravelRequestSteps
