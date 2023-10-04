<template>
  <v-dialog
    v-model="showDialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit Estimate</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-text-field
            v-model="estimate.type"
            label="Expense Type"
          ></v-text-field>
          <v-text-field
            v-model="estimate.description"
            label="Description"
          ></v-text-field>
          <v-text-field
            v-model="estimate.date"
            label="Date"
          ></v-text-field>
          <v-text-field
            v-model="estimate.cost"
            label="Amount"
          ></v-text-field>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EstimateEditDialog",
  props: {},
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
      this.$nextTick(() => {
        this.estimate = {}
      })
    },
    save() {
      // TODO: save to back-end
      // use save event to trigger table reload
      this.$emit("save", this.estimate.id)
      this.close()
    },
  },
}
</script>
