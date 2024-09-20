<template>
  <div>
    <v-dialog
      v-model="showModal"
      persistent
      max-width="800px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :disabled="disabled"
          style="min-width: 0"
          color="primary"
          @click="initForm()"
          v-bind="attrs"
          v-on="on"
        >
          <div v-if="type == 'New'">Add New Agency</div>
          <v-icon v-else>mdi-pen</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title
          class="primary"
          style="border-bottom: 1px solid black"
        >
          <div class="text-h5">Travel Agency Information</div>
        </v-card-title>

        <v-card-text>
          <v-row class="mt-5">
            <v-col cols="4">
              <v-text-field
                :error="state.agencyNameErr"
                @input="state.agencyNameErr = false"
                label="Agency Name"
                v-model="agencyInfo.agencyName"
                outlined
              />
            </v-col>
            <v-col cols="8">
              <v-textarea
                class=""
                :error="state.agencyInfoErr"
                @input="state.agencyInfoErr = false"
                label="Paste Travel Agency Information Here"
                v-model="agencyInfo.agencyInfo"
                clearable
                outlined
              />
            </v-col>
          </v-row>

          <v-row class="mx-0">
            <v-btn
              color="grey darken-5"
              class="my-0 ml-1 px-5"
              @click="closeModal()"
            >
              Cancel
            </v-btn>

            <v-btn
              @click="save()"
              style="min-width: 0"
              color="success"
              class="ml-auto mr-1 my-0 px-5"
              >Save
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "NewTravelAgency",
  components: {},
  props: {
    disabled: { type: Boolean },
    type: { type: String },
    agencyInfo: {},
  },
  data() {
    return {
      showModal: false,
      state: {
        agencyNameErr: false,
        agencyInfoErr: false,
      },
    }
  },
  mounted() {},
  methods: {
    initForm() {
      if (this.type == "New") {
        this.agencyInfo.agencyName = ""
        this.agencyInfo.agencyInfo = ""
        this.agencyInfo.id = 0
      }
      this.state.agencyNameErr = false
      this.state.agencyInfoErr = false
    },

    save() {
      if (this.checkStates()) {
        this.$emit("save", this.agencyInfo)
        this.closeModal()
      }
    },

    checkStates() {
      this.state.agencyNameErr = this.agencyInfo.agencyName ? false : true
      this.state.agencyInfoErr = this.agencyInfo.agencyInfo ? false : true
      return !this.state.agencyNameErr && !this.state.agencyInfoErr
    },

    closeModal() {
      this.showModal = false
    },
  },
}
</script>

<style scoped></style>
