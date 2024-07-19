<template>
  <div>
    <v-dialog
      v-model="transportationDialog"
      persistent
      max-width="80%"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          :class="type == 'Add New' ? 'my-4 right' : 'mx-0 px-0'"
          :color="type == 'Add New' ? 'primary' : 'transparent'"
          style="min-width: 0"
          v-bind="attrs"
          @click="initForm"
          v-on="on"
        >
          <div v-if="type == 'Add New'">Add Transportation</div>
          <v-icon
            v-else
            class="mx-0 px-0"
            color="blue"
            >mdi-pencil</v-icon
          >
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="blue">
          <div class="text-h5">Add Transportation</div>
        </v-card-title>

        <v-card-text>
          <v-row class="mt-5 mx-0">
            <v-col cols="3">
              <v-select
                v-model="otherTransportationRequest.transportationType"
                :items="requestList"
                :error="state.transportationTypeErr"
                label="Request Type:"
                outlined
              />
            </v-col>
            <v-col cols="9"> </v-col>
          </v-row>
          <v-row class="mt-0 mx-0">
            <v-col cols="3">
              <v-autocomplete
                v-model="otherTransportationRequest.depart"
                :items="destinations"
                item-value="text"
                :error="state.departErr"
                label="Depart"
                outlined
                @change="state.departErr = false"
              />
            </v-col>
            <v-col cols="3">
              <v-autocomplete
                v-model="otherTransportationRequest.arrive"
                :items="destinations"
                item-value="text"
                :error="state.arriveErr"
                label="Arrive"
                outlined
                @change="state.arriveErr = false"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="date"
                :readonly="readonly"
                :error="state.dateErr"
                label="Date"
                outlined
                :min="minDate"
                :max="maxDate"
                type="date"
                @input="state.dateErr = false"
              />
            </v-col>
            <v-col cols="4">
              <v-textarea
                v-model="otherTransportationRequest.additionalNotes"
                :error="state.additionalNotesErr"
                label="Additional Information"
                outlined
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="grey darken-5"
            @click="transportationDialog = false"
          >
            <div v-if="type == 'View'">Close</div>
            <div v-else>Cancel</div>
          </v-btn>
          <v-btn
            class="ml-auto"
            color="green darken-1"
            @click="saveTransportationRequest"
          >
            <div v-if="type == 'View'">Save</div>
            <div v-else>Add</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "NewTransportationRequest",
  props: {
    type: {
      type: String,
      default: "Add New",
    },
    otherTransportationRequest: {
      type: Object,
      default: () => ({}),
    },
    minDate: {
      type: String,
      default: "",
    },
    maxDate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      date: "",
      transportationDialog: false,
      requestList: ["Shuttle", "Bus", "Train"],
      readonly: false,
      state: {
        transportationTypeErr: false,
        departErr: false,
        arriveErr: false,
        dateErr: false,
        additionalNotesErr: false,
      },
      destinations: [],
    }
  },
  mounted() {
    this.destinations = this.$store.state.traveldesk.destinations
  },
  methods: {
    checkFields() {
      this.state.transportationTypeErr = this.otherTransportationRequest.transportationType
        ? false
        : true
      this.state.departErr = this.otherTransportationRequest.depart ? false : true
      this.state.arriveErr = this.otherTransportationRequest.arrive ? false : true
      this.state.dateErr = this.date ? false : true
      this.state.additionalNotesErr = false //

      for (const key of Object.keys(this.state)) {
        if (this.state[key]) return false
      }
      return true
    },

    saveTransportationRequest() {
      if (this.checkFields()) {
        this.otherTransportationRequest.date = this.date + "T00:00:00.000Z"
        this.$emit("updateTable", this.type)
        this.transportationDialog = false
      }
    },

    initForm() {
      this.initStates()

      if (this.type == "Add New") {
        this.otherTransportationRequest.transportationType = ""
        this.otherTransportationRequest.depart = ""
        this.otherTransportationRequest.arrive = ""
        this.otherTransportationRequest.additionalNotes = ""
        this.otherTransportationRequest.status = "Requested" //, Reserved"
        this.date = ""
      } else {
        this.date = this.otherTransportationRequest.date.slice(0, 10)
      }
    },

    initStates() {
      for (const key of Object.keys(this.state)) {
        this.state[key] = false
      }
    },
  },
}
</script>

<style scoped></style>
