import { unref } from "vue"
import { isNil } from "lodash"

/**
 * @typedef {{
 *   id: string;
 *   title: string;
 *   subtitle: string;
 *   to: {
 *     name: string;
 *     params?: Object;
 *   };
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

  if (isNil(options.to)) {
    throw new Error("to is required")
  }

  if (isNil(options.to.name)) {
    throw new Error("to.name is required")
  }

  if (isNil(options.to.params)) {
    throw new Error("to.params is required")
  }

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

  return [
    {
      id: "edit-travel-authorization-purpose-details",
      title: "Details: purpose",
      subtitle: "Enter trip purpose",
      to: {
        name: "my-travel-requests/details/DetailsEditPurposePage",
        params: {
          travelAuthorizationId,
        },
      },
    },
    {
      id: "edit-travel-authorization-trip-details",
      title: "Details: trip",
      subtitle: "Enter trip details",
      to: {
        name: "my-travel-requests/details/DetailsEditTripPage",
        params: {
          travelAuthorizationId,
        },
      },
    },
    {
      id: "edit-expense-estimate",
      title: "Estimate: edit",
      subtitle: "Generate estimate",
      to: {
        name: "my-travel-requests/estimate/EstimateEditPage",
        params: {
          travelAuthorizationId,
        },
      },
    },
    {
      id: "submit-travel-authorization",
      title: "Details: submit",
      subtitle: "Submit travel request",
      to: {
        name: "my-travel-requests/details/DetailsSubmitPage",
        params: {
          travelAuthorizationId,
        },
      },
      continueButtonText: "Submit to Supervisor",
    },
    {
      id: "review-travel-authorization-trip-details",
      title: "Details",
      subtitle: "Review submitted trip details",
      to: {
        name: "my-travel-requests/details/DetailsPage",
        params: {
          travelAuthorizationId,
        },
      },
      backButtonText: "Revert to Draft",
      backButtonProps: {
        color: "warning",
      },
    },
    {
      id: "review-expense-estimate",
      title: "Estimate",
      subtitle: "Review submitted estimate",
      to: {
        name: "my-travel-requests/estimate/EstimatePage",
        params: {
          travelAuthorizationId,
        },
      },
    },
    {
      id: "awaiting-travel-authorization-approval",
      title: "Waiting for approval",
      subtitle: "Travel request is submitted to supervisor and waiting for approval.",
      to: {
        name: "my-travel-requests/AwaitingApprovalPage",
        params: {
          travelAuthorizationId,
        },
      },
      continueButtonProps: {
        disabled: true,
      },
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
      id: "edit-travel-desk-travel-request-other-models",
      title: "Request: edit",
      subtitle: "Edit travel desk request",
      to: {
        name: "my-travel-requests/request/RequestEditPage",
        params: {
          travelAuthorizationId,
        },
      },
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
