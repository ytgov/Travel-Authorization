<template>
  <v-btn
    class="ma-0"
    color="secondary"
    @click.stop="submitExpenseClaim"
  >
    Submit Expense Claim
  </v-btn>
</template>

<script>
export default {
  name: "SubmitExpenseClaimButton",
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    submitExpenseClaim() {
      alert("TODO: submit expense claim for travel authorization " + this.travelAuthorizationId)
    },
  },
}
</script>
