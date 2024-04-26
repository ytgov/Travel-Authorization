<template>
  <div>
    <TitleCard
      class="mt-10 mx-5"
      title-width="8.5rem"
    >
      <template #title>
        <div>Hotel Request</div>
      </template>
      <template #body>
        <v-row class="mt-3 mx-3">
          <NewHotelRequest
            v-if="!readonly"
            class="ml-auto mr-3"
            type="Add New"
            :min-date="minDate"
            :max-date="maxDate"
            :flight-requests="flightRequests"
            :hotel-request="hotelRequest"
            @updateTable="updateTable"
          />
        </v-row>
        <v-row class="mb-3 mx-3">
          <v-col
            v-if="hotels?.length > 0"
            cols="12"
          >
            <v-data-table
              :headers="hotelHeaders"
              :items="hotels"
              hide-default-footer
              class="elevation-1"
            >
              <template #item.isDedicatedConferenceHotelAvailable="{ item }">
                {{ item.isDedicatedConferenceHotelAvailable ? "Yes" : "No" }}
              </template>

              <template #item.checkIn="{ item }">
                {{ item.checkIn | beautifyDateTime }}
              </template>

              <template #item.checkOut="{ item }">
                {{ item.checkOut | beautifyDateTime }}
              </template>

              <template #item.edit="{ item }">
                <v-row class="m-0 p-0">
                  <NewHotelRequest
                    v-if="!readonly"
                    type="Edit"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :flight-requests="flightRequests"
                    :hotel-request="item"
                    @updateTable="updateTable"
                  />
                  <v-btn
                    v-if="!readonly"
                    style="min-width: 0"
                    color="transparent"
                    class="px-1 pt-2"
                    small
                    @click="removeHotel(item)"
                    ><v-icon
                      class=""
                      color="red"
                      >mdi-close</v-icon
                    >
                  </v-btn>
                </v-row>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </template>
    </TitleCard>
  </div>
</template>

<script>
import TitleCard from "@/modules/travelDesk/views/Common/TitleCard.vue"
import NewHotelRequest from "@/modules/travelDesk/views/Requests/RequestDialogs/NewHotelRequest.vue"

export default {
  name: "HotelRequestTable",
  components: {
    TitleCard,
    NewHotelRequest,
  },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    hotels: {
      type: Array,
      default: () => [],
    },
    flightRequests: {
      type: Array,
      default: () => [],
    },
    authorizedTravel: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      hotelHeaders: [
        { text: "Check-in", value: "checkIn", class: "blue-grey lighten-4" },
        { text: "Check-out", value: "checkOut", class: "blue-grey lighten-4" },
        { text: "City", value: "city", class: "blue-grey lighten-4", sortable: false },
        {
          text: "Conference Hotel?",
          value: "isDedicatedConferenceHotelAvailable",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Conference/Meeting Name",
          value: "conferenceName",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Conference/Meeting Hotel",
          value: "conferenceHotelName",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        {
          text: "Additional Information",
          value: "additionalInformation",
          class: "blue-grey lighten-4",
          sortable: false,
        },
        { text: "", value: "edit", class: "blue-grey lighten-4", width: "4rem", sortable: false },
      ],
      hotelRequest: {},
      tmpId: 1,
      admin: false,
      travelerDetails: {},
      savingData: false,
      minDate: "",
      maxDate: "",
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    updateTable(type) {
      if (type == "Add New") {
        this.hotelRequest.tmpId = this.tmpId
        this.hotels.push(JSON.parse(JSON.stringify(this.hotelRequest)))
        this.tmpId++
      }
    },

    initForm() {
      if (this.authorizedTravel?.startDate && this.authorizedTravel?.endDate) {
        this.minDate = this.authorizedTravel.startDate.slice(0, 10)
        this.maxDate = this.authorizedTravel.endDate.slice(0, 10)
      }

      const hotelRequest = {}
      hotelRequest.id = null
      hotelRequest.tmpId = null
      hotelRequest.checkIn = ""
      hotelRequest.checkOut = ""
      hotelRequest.city = ""
      hotelRequest.isDedicatedConferenceHotelAvailable = true
      hotelRequest.conferenceName = ""
      hotelRequest.conferenceHotelName = ""
      hotelRequest.additionalInformation = ""
      hotelRequest.status = "Requested"

      this.hotelRequest = hotelRequest
    },

    editHotel(item) {
      this.hotelRequest = item
    },

    removeHotel(item) {
      console.log(item)
      let delIndex = -1
      if (item.id > 0) {
        delIndex = this.hotels.findIndex((hotel) => hotel.id && hotel.id == item.id)
      } else {
        delIndex = this.hotels.findIndex((hotel) => hotel.tmpId && hotel.tmpId == item.tmpId)
      }

      if (delIndex >= 0) {
        this.hotels.splice(delIndex, 1)
      }
    },
  },
}
</script>

<style scoped></style>
