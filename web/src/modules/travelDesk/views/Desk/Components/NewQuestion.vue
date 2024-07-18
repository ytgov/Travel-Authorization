<template>
  <div>
    <title-card
      class="mt-10"
      title-width="6rem"
    >
      <template #title>
        <div>Question</div>
      </template>
      <template #body>
        <v-row class="mt-3 mb-0 mx-0">
          <v-col cols="8">
            <v-select
              v-model="question.requestType"
              :readonly="!travelDeskUser || readonly"
              :items="questionList"
              label="About"
              outlined
            />
          </v-col>
        </v-row>

        <v-row class="my-n10 mx-0">
          <v-col cols="12">
            <v-text-field
              v-model="question.question"
              :readonly="!travelDeskUser || readonly"
              :error="question.state.questionErr"
              label="Question"
              outlined
              @input="question.state.questionErr = false"
            />
          </v-col>
        </v-row>

        <v-row class="my-n5 mx-0">
          <v-col cols="12">
            <v-text-field
              v-model="question.response"
              :readonly="readonly"
              :error="question.state.responseErr"
              label="Response"
              outlined
              @input="question.state.responseErr = false"
            />
          </v-col>
        </v-row>
      </template>
    </title-card>
  </div>
</template>

<script>
// import Vue from "vue";
import TitleCard from "../../Common/TitleCard.vue"

export default {
  name: "NewQuestion",
  components: {
    TitleCard,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    readonly: { type: Boolean, default: false },
    travelDeskUser: { type: Boolean, default: false },
  },
  data() {
    return {
      questionList: ["Flight", "Hotel", "Rental Car", "Transportation"],
    }
  },
  mounted() {},
  methods: {
    // checkFields() {
    // 	return true;
    // },
  },
}
</script>

<style scoped></style>
