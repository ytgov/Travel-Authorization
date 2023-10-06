<template>
  <v-dialog
    v-model="showDialog"
    max-width="500px"
  >
    <v-card>
      <!-- TODO: add estimate description? to this dialog -->
      <v-card-title class="text-h5"
        >Are you sure you want to delete this estimate?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          :loading="loading"
          @click="close"
          >Cancel</v-btn
        >
        <v-btn
          color="error"
          :loading="loading"
          @click="deleteAndClose"
          >OK</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import expensesApi from '@/apis/expenses-api'

export default {
  name: "EstimateDeleteDialog",
  data: () => ({
    estimate: {},
    showDialog: false,
    loading: false,
  }),
  computed: {
    estimateId() {
      return this.estimate.id
    },
  },
  methods: {
    show(estimate) {
      this.estimate = estimate
      this.showDialog = true
    },
    close() {
      this.showDialog = false
    },
    deleteAndClose() {
      this.loading = true
      return expensesApi
        .delete(this.estimateId)
        .then(() => {
          this.$emit("deleted")
          this.close()
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
