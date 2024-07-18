<template>
  <div>
    <title-card
      class="mt-10 mx-4"
      title-width="6rem"
    >
      <template #title>
        <div>Questions</div>
      </template>
      <template #body>
        <v-row
          v-if="travelDeskUser && !readonly"
          class="my-1 mx-3"
        >
          <v-btn
            class="ml-auto px-2"
            style="min-width: 0"
            color="primary"
            @click="newForm"
          >
            <div>Add Question</div>
          </v-btn>
        </v-row>
        <div
          v-else-if="sortedQuestions.length == 0"
          class="text-center my-5"
        >
          No Question
        </div>

        <v-row
          v-for="(question, inx) in sortedQuestions"
          :key="'question-' + inx"
          class="mb-3 mt-3 mx-2"
        >
          <v-col>
            <NewQuestion
              class="mt-n10"
              :readonly="readonly"
              :question="question"
              :travel-desk-user="travelDeskUser"
            />
          </v-col>
        </v-row>
      </template>
    </title-card>
  </div>
</template>

<script>
import TitleCard from "../../Common/TitleCard.vue"
import NewQuestion from "./NewQuestion.vue"

export default {
  name: "QuestionsTable",
  components: {
    TitleCard,
    NewQuestion,
  },
  props: {
    readonly: { type: Boolean, default: false },
    questions: {
      type: Array,
      default: () => [],
    },
    travelDeskUser: { type: Boolean, default: false },
  },
  data() {
    return {
      tmpId: 1,
      admin: false,
      savingData: false,
      sortedQuestions: [],
    }
  },
  computed: {},
  mounted() {
    this.sortedQuestions = this.sortQuestion(this.questions)
  },
  methods: {
    newForm() {
      this.questions.push({
        question: "",
        response: "",
        requestType: "Hotel",
        state: {
          questionErr: false,
          responseErr: false,
        },
      })
    },

    sortQuestion(questions) {
      questions.sort((a) => {
        if (!a.response) return -1
        else return 1
      })
      return questions
    },
  },
}
</script>

<style scoped></style>
