<template>
  <v-dialog
    :value="showDialog"
    persistent
    max-width="500px"
    @keydown.esc="hide"
    @input="hideIfFalse"
  >
    <v-form
      ref="form"
      @submit.prevent="updateAndHide"
    >
      <v-skeleton-loader
        v-if="isNil(travelDeskQuestionId) || isNil(travelDeskQuestion)"
        type="card"
      />
      <v-card
        v-else
        :loading="isLoading"
      >
        <v-card-title>
          <h2>Edit Question</h2>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col>
              <RequestTypeSelect
                v-model="travelDeskQuestion.requestType"
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
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="hide"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="primary"
            text
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
import { isNil } from "lodash"

import travelDeskQuestionsApi from "@/api/travel-desk-questions-api"

import { required } from "@/utils/validators"
import useSnack from "@/use/use-snack"
import useRouteQuery, { integerTransformer } from "@/use/utils/use-route-query"
import useTravelDeskQuestion from "@/use/use-travel-desk-question"

import RequestTypeSelect from "@/components/travel-desk-questions/RequestTypeSelect.vue"

const emit = defineEmits(["saved"])

const travelDeskQuestionId = useRouteQuery("showQuestionEdit", undefined, {
  transformer: integerTransformer,
})

const { travelDeskQuestion, isLoading } = useTravelDeskQuestion(travelDeskQuestionId)

function show(newTravelDeskQuestionId) {
  travelDeskQuestionId.value = newTravelDeskQuestionId
}

function hide() {
  travelDeskQuestionId.value = undefined
}

const showDialog = ref(false)
const form = ref(null)

watch(
  travelDeskQuestionId,
  (newTravelDeskQuestionId) => {
    if (isNil(newTravelDeskQuestionId)) {
      showDialog.value = false
      travelDeskQuestion.value = null
      form.value?.resetValidation()
    } else {
      showDialog.value = true
    }
  },
  {
    immediate: true,
  }
)

const snack = useSnack()

async function updateAndHide() {
  if (!form.value.validate()) return

  isLoading.value = true
  try {
    await travelDeskQuestionsApi.update(travelDeskQuestionId.value, travelDeskQuestion.value)
    snack.success("Question updated successfully")
    emit("saved")
    hide()
  } catch (error) {
    console.error(error)
    snack.error(`Failed to update question: ${error}`)
  } finally {
    isLoading.value = false
  }
}

function hideIfFalse(value) {
  if (!value) {
    hide()
  }
}

defineExpose({
  show,
})
</script>

<style scoped></style>
