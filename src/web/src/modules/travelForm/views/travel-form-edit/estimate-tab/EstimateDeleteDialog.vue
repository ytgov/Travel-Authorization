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
          color="blue darken-1"
          text
          @click="close"
          >Cancel</v-btn
        >
        <v-btn
          color="blue darken-1"
          text
          @click="deleteAndClose"
          >OK</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EstimateDeleteDialog",
  data: () => ({
    estimate: {},
    showDialog: false,
  }),
  methods: {
    show(estimate) {
      this.estimate = estimate
      this.showDialog = true
    },
    close() {
      this.showDialog = false
    },
    deleteAndClose() {
      // TODO: delete from back-end
      // use delete event to trigger table reload
      this.$emit("delete", this.estimate.id)
      this.close()
    },
  },
}
</script>
