<template>
  <v-card
    :style="{
      padding: '10px',
    }"
  >
    <v-file-input
      v-model="image"
      label="File input"
      @change="Preview_image"
    >
    </v-file-input>
  </v-card>
</template>

<script>
import http from "@/api/http-client"
import { FORM_URL } from "@/urls"

export default {
  name: "UploadReceipts",
  data() {
    return {
      url: null,
      image: null,
    }
  },
  methods: {
    Preview_image() {
      if (this.image) {
        this.url = URL.createObjectURL(this.image)
      } else {
        this.url = ""
      }
    },
    uploadImage() {
      return http
        .post(`${FORM_URL}/uploadReceipt`, this.image, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>
