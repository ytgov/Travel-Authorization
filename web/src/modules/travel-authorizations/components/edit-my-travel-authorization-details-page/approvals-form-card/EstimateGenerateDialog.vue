<template>
  <v-dialog
    v-model="showDialog"
    max-width="500px"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        dark
        :class="buttonClasses"
        :color="buttonColor"
        v-bind="attrs"
        v-on="on"
      >
        Generate Estimate
      </v-btn>
    </template>
    <v-form @submit.prevent="createAndClose">
      <v-card :loading="loading">
        <v-card-title class="text-h5"> Generate Estimate? </v-card-title>

        <v-card-text>
          <p>
            By proceeding, the travel request will be saved, and initial cost estimates will be
            pre-populated. You'll have the opportunity to review and modify the estimates afterward.
          </p>
          <p>
            <em>This might take a some time...</em>
          </p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :loading="loading"
            color="error"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            :loading="loading"
            color="primary"
            type="submit"
          >
            Save & Generate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions } from "vuex"

import { required } from "@/utils/validators"

import generateApi from "@/api/travel-authorizations/estimates/generate-api"

export default {
  name: "EstimateGenerateDialog",
  components: {},
  props: {
    travelAuthorizationId: {
      type: Number,
      required: true,
    },
    buttonClasses: {
      type: [String, Array, Object],
      default: () => "mb-2",
    },
    buttonColor: {
      type: String,
      default: "primary",
    },
  },
  data() {
    return {
      showDialog: this.$route.query.showGenerate === "true",
      loading: false,
    }
  },
  watch: {
    showDialog(value) {
      if (value) {
        this.$router.push({ query: { showGenerate: value } })
      } else {
        this.$router.push({ query: { showGenerate: undefined } })
      }
    },
  },
  async mounted() {
    await this.ensureTravelAuthorization(this.travelAuthorizationId)
  },
  methods: {
    required,
    ...mapActions("travelAuthorization", {
      ensureTravelAuthorization: "ensure",
      saveTravelAuthorizationSilently: "saveSilently",
    }),
    close() {
      this.showDialog = false
    },
    async createAndClose() {
      this.loading = true
      try {
        await this.saveTravelAuthorizationSilently()
        await generateApi.create(this.travelAuthorizationId)
        this.$emit("created")
        this.close()
      } catch (error) {
        this.$snack(error.message, { color: "error" })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
