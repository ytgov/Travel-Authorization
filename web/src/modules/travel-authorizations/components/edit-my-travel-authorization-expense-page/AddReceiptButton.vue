<template>
  <span class="ml-2">
    <input
      ref="fileInput"
      class="d-none"
      type="file"
      @change="onFileSelected"
    />
    <v-btn
      color="primary"
      @click="triggerFileInput"
    >
      Add Receipt
    </v-btn>
  </span>
</template>

<script>
import expensesApi from "@/api/expenses-api"

export default {
  props: {
    expenseId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      file: null,
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    onFileSelected(event) {
      this.file = event.target.files[0]
      this.uploadFile()
    },
    uploadFile() {
      expensesApi
        .upload(this.expenseId, this.file)
        .then((response) => {
          // Handle response
          console.log(response.data)
        })
        .catch((error) => {
          // Handle error
          console.error(error)
        })
    },
  },
}
</script>
