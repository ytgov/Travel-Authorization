<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="500px"
    @keydown.esc="hide"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="primary"
        v-bind="attrs"
        v-on="on"
      >
        Add Question
      </v-btn>
    </template>

    <v-form
      ref="form"
      @submit.prevent="createAndHide"
    >
      <v-card>
        <v-card-title>
          <h2>Add Question</h2>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <!-- TODO: make this a component -->
              <v-select
                v-model="travelDeskQuestion.requestType"
                :items="requestTypes"
                :rules="[required]"
                label="Request Type *"
                outlined
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="travelDeskQuestion.question"
                :rules="[required]"
                label="Question *"
                outlined
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="travelDeskQuestion.response"
                label="Response"
                outlined
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="isLoading"
            color="warning"
            outlined
            @click="hide"
          >
            Cancel
          </v-btn>
          <v-btn
            :loading="isLoading"
            color="primary"
            type="submit"
          >
            Create Question
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue"

import { required } from "@/utils/validators"

import travelDeskQuestionsApi from "@/api/travel-desk-questions-api"

import useRouteQuery from "@/use/utils/use-route-query"
import useSnack from "@/use/use-snack"

const props = defineProps({
  attributes: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(["created"])

const requestTypes = [
  { text: "Flight", value: "flight" },
  { text: "Hotel", value: "hotel" },
  { text: "Transportation", value: "transportation" },
  { text: "Rental Car", value: "rental_car" },
]

const travelDeskQuestion = ref({
  requestType: "",
  question: "",
  response: "",
  ...props.attributes,
})

const snack = useSnack()
const showDialog = useRouteQuery("showTravelDeskQuestionCreate", false, { transform: Boolean })

/** @type {import("vue").Ref<InstanceType<typeof import("vuetify/lib").VForm> | null>} */
const form = ref(null)
const isLoading = ref(false)

function hide() {
  showDialog.value = false
  resetQuestion()
  form.value?.resetValidation()
}

async function createAndHide() {
  if (!form.value?.validate()) {
    snack.error("Please fill in all required fields")
    return
  }

  isLoading.value = true
  try {
    const { travelDeskQuestion: newTravelDeskQuestion } = await travelDeskQuestionsApi.create(
      travelDeskQuestion.value
    )
    emit("created", newTravelDeskQuestion)
    snack.success("Question created successfully")
    hide()
  } catch (error) {
    console.error(error)
    snack.error(`Failed to create travel desk question: ${error}`)
  } finally {
    isLoading.value = false
  }
}

function resetQuestion() {
  travelDeskQuestion.value = {
    requestType: "",
    question: "",
    response: "",
    ...props.attributes,
  }
}
</script>

<style scoped></style>
