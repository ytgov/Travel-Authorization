<template>
  <div>
    <v-dialog
      v-model="approveTravelDialog"
      persistent
      max-width="950px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          small
          class="my-0"
          color="primary"
          @click="extractTravelRequests()"
          v-bind="attrs"
          v-on="on"
        >
          Approve
        </v-btn>
      </template>

      <v-card>
        <v-card-title style="border-bottom: 1px solid black">
          <div class="text-h5">Approval</div>
        </v-card-title>

        <v-card-text>
          <v-row class="mt-10">
            <v-col cols="6">
              <v-text-field
                :error="approvedByErr"
                @input="approvedByErr = false"
                v-model="approvedBy"
                label="Approved By"
                outlined
                clearable
              />
            </v-col>
            <v-col cols="1" />
            <v-col cols="3">
              <v-text-field
                :error="approvalDateErr"
                @input="approvalDateErr = false"
                v-model="approvalDate"
                label="Approval Date"
                outlined
                type="date"
              />
            </v-col>
            <v-col cols="1" />
          </v-row>

          <v-row
            class="mt-1 mb-5"
            align="center"
            justify="center"
          >
            <v-col cols="4">
              <v-btn
                class="ml-1"
                color="primary"
                @click="uploadApproval"
              >
                Upload Approval
                <input
                  id="inputfile"
                  type="file"
                  style="display: none"
                  accept="application/pdf,image/x-png,image/jpeg"
                  @change="handleSelectedFile"
                  onclick="this.value=null;"
                />
              </v-btn>
            </v-col>
            <v-col cols="1" />
            <v-col
              :key="update"
              class="blue--text text-h6 text-decoration-underline"
              cols="7"
            >
              <a
                v-if="reader.result"
                :href="reader.result"
                download="UploadedFile.pdf"
                target="_blank"
                >{{ approvalFileName }}</a
              >
            </v-col>
          </v-row>

          <v-row class="mt-1 mb-5">
            <v-col>
              <v-data-table
                :headers="headers"
                :items="approvalRequests"
                :items-per-page="5"
                class="elevation-1"
                hide-default-footer
              >
                <template v-slot:item.name="{ item }">
                  <v-tooltip
                    top
                    color="primary"
                  >
                    <template v-slot:activator="{ on }">
                      <div v-on="item.travelers.length > 1 ? on : ''">
                        <span>
                          {{ item.travelers[0].fullName.replace(".", " ") }}
                        </span>
                        <span v-if="item.travelers.length > 1">, ... </span>
                      </div>
                    </template>
                    <span
                      ><div
                        v-for="(trv, inx) in item.travelers"
                        :key="inx"
                      >
                        {{ trv.fullName.replace(".", " ") }}
                      </div></span
                    >
                  </v-tooltip>
                </template>

                <template v-slot:item.status="{ item }">
                  <v-select
                    :background-color="
                      item.status == 'declined'
                        ? 'red lighten-4'
                        : item.status == 'approved'
                          ? 'green lighten-4'
                          : 'grey lighten-4'
                    "
                    class="my-0 py-0"
                    dense
                    hide-details
                    @change="alert = false"
                    v-model="item.status"
                    :items="statusList"
                    label=""
                    solo
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <v-alert
            v-model="alert"
            dense
            color="red darken-4"
            dark
            dismissible
          >
            {{ alertMsg }}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="grey darken-5"
            @click="approveTravelDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            class="ml-auto"
            color="green darken-1"
            :loading="savingData"
            @click="saveApproval()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { PREAPPROVED_URL } from "../../../../urls"
import { securePost } from "../../../../store/jwt"

export default {
  components: {},
  name: "ApproveTravel",
  props: {
    travelRequests: {
      type: [],
    },
    submissionId: {
      type: Number,
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Name",
          value: "name",
          class: "blue-grey lighten-4",
        },
        {
          text: "Branch",
          value: "branch",
          class: "blue-grey lighten-4",
        },
        {
          text: "Reason",
          value: "reason",
          class: "blue-grey lighten-4",
        },
        {
          text: "Location",
          value: "location",
          class: "blue-grey lighten-4",
        },
        {
          text: "Status",
          value: "status",
          class: "blue-grey lighten-4",
          sortable: false,
          width: "11rem",
        },
      ],
      approvalRequests: [],
      approvedBy: "",
      approvedByErr: false,
      approvalDate: "",
      approvalDateErr: false,
      statusList: ["Approved", "Declined", "Submitted"],
      approveTravelDialog: false,
      approvalFileType: "",
      approvalFileName: "",
      alert: false,
      alertMsg: "",
      savingData: false,
      reader: new FileReader(),
      update: 0,
    }
  },
  mounted() {},
  methods: {
    extractTravelRequests() {
      this.alert = false
      this.approvalFileName = ""
      this.approvalFileType = ""
      this.approvedBy = ""
      this.approvalDate = ""
      this.approvedByErr = false
      this.approvalDateErr = false
      this.approvalRequests = JSON.parse(JSON.stringify(this.travelRequests))
    },

    uploadApproval() {
      this.alert = false
      const el = document.getElementById("inputfile")
      if (el) el.click()
    },

    handleSelectedFile(event) {
      event.preventDefault()
      event.stopPropagation()

      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0]

        this.approvalFileType = file.type
        this.approvalFileName = file.name

        this.reader.onload = () => {
          this.update++
        }
        this.reader.readAsDataURL(file)
      }
    },

    checkFields() {
      this.alert = false

      this.approvedByErr = this.approvedBy ? false : true
      this.approvalDateErr = this.approvalDate ? false : true
      if (this.approvedByErr || this.approvalDateErr) return false

      for (const req of this.approvalRequests) {
        if (req.status != "Approved" && req.status != "Declined") {
          this.alertMsg =
            "Please select either 'Approved' or 'Declined' status for all the records."
          this.alert = true
          return false
        }
      }
      return true
    },

    saveApproval() {
      this.alert = false

      if (this.checkFields()) {
        if (!this.reader?.result || this.approvalFileType != "application/pdf") {
          this.alertMsg = "Please upload the approval PDF file."
          this.alert = true
          return
        }

        this.savingData = true
        const data = {
          status: "Finished",
          approvalDate: this.approvalDate,
          approvedBy: this.approvedBy,
          preapproved: this.approvalRequests.map((req) => {
            return {
              preTID: req.preTID,
              status: req.status,
            }
          }),
        }
        const bodyFormData = new FormData()
        bodyFormData.append("file", this.reader.result)
        bodyFormData.append("data", JSON.stringify(data))

        const header = {
          responseType: "application/pdf",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }

        securePost(`${PREAPPROVED_URL}/approval/${this.submissionId}`, bodyFormData, header)
          .then(() => {
            this.savingData = false
            this.approveTravelDialog = false
            this.$emit("updateTable")
          })
          .catch((e) => {
            this.savingData = false
            console.log(e.response.data)
            this.alertMsg = e.response.data
            this.alert = true
          })
      }
    },
  },
}
</script>

<style scoped>
::v-deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
