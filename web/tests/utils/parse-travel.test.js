import parseTravel from "@/utils/parse-travel"

describe("web/src/utils/travel/parse-travel.js", () => {
  describe(".parseTravel", () => {
    test("when given example data, parses it correctly", () => {
      const text = `
        Passenger:
        Pasenger details here...

        Flights:
        Air Canada AC303
        Departure: 13 Jan 09:05 Pierre Elliott Trudeau Intl Arpt (YUL) Terminal:
        Arrival: 13 Jan 11:53 Vancouver Intl Arpt (YVR) Terminal: M
        Duration: 5 Hour(s) 48 Minutes
        Status: Confirmed
        Class: Q
        Air Canada AC304
        Departure: 13 Jan 09:05 Pierre Elliott Trudeau Intl Arpt (YUL) Terminal:
        Arrival: 13 Jan 11:53 Vancouver Intl Arpt (YVR) Terminal: M
        Duration: 5 Hour(s) 48 Minutes
        Status: Confirmed
        Class: Q

        Hotels:
        Hotel details here...

        Cars:
        Car rental details here...
      `
      const textWithoutPrecedingWhitespace = text.replace(/^[ \t]+/gm, "").trim()
      const result = parseTravel(textWithoutPrecedingWhitespace)

      expect(result).toEqual({
        cars: [],
        flights: [
          {
            airline: "Air Canada",
            arrivalAirport: "Vancouver Intl Arpt",
            arrivalAirportCode: "YVR",
            arrivalDate: "13 Jan",
            arrivalTime: "11:53",
            class: "Q",
            departureAirport: "Pierre Elliott Trudeau Intl Arpt",
            departureAirportCode: "YUL",
            departureDate: "13 Jan",
            departureTime: "09:05",
            duration: "5 Hour(s) 48 Minutes",
            flightNumber: "AC303",
            status: "Confirmed",
            terminal: "",
          },
          {
            airline: "Air Canada",
            arrivalAirport: "Vancouver Intl Arpt",
            arrivalAirportCode: "YVR",
            arrivalDate: "13 Jan",
            arrivalTime: "11:53",
            class: "Q",
            departureAirport: "Pierre Elliott Trudeau Intl Arpt",
            departureAirportCode: "YUL",
            departureDate: "13 Jan",
            departureTime: "09:05",
            duration: "5 Hour(s) 48 Minutes",
            flightNumber: "AC304",
            status: "Confirmed",
            terminal: "",
          },
        ],
        hotels: [],
        passengers: [],
      })
    })
  })
})
