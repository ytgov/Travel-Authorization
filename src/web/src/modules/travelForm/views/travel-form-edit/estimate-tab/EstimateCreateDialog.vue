<template>
  <v-dialog
    v-model="showDialog"
    max-width="500px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        dark
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        Add Estimate
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Create Estimate</span>
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
  name: "EstimateCreateDialog",
  props: {
    formId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    estimate: {},
    showDialog: false,
  }),
  methods: {
    close() {
      this.showDialog = false
      this.$nextTick(() => {
        this.estimate = {}
      })
    },
    save() {
      // TODO: save to back-end
      // use save event to trigger table reload
      this.$emit("save", this.estimate)
      this.close()
    }
  }
}
</script>
