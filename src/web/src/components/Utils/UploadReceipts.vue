<template>
  <v-card :style="{ padding: '10px' }">
    <v-file-input label="File input" @change="Preview_image" v-model="image">
    </v-file-input>
  </v-card>
</template>
 
 <script>
import axios from "axios";
import { FORM_URL } from "../../urls";

export default {
  name: "imageUpload",
  data() {
    return {
      url: null,
      image: null,
    };
  },
  methods: {
    Preview_image() {
      if (this.image) {
        this.url = URL.createObjectURL(this.image);
      } else {
        this.url = "";
      }
    },
    uploadImage() {
      axios
        .post(`${FORM_URL}/uploadReceipt`, this.image, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
