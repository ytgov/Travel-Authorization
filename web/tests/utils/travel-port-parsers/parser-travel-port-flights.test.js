import parseTravelportFlights from "@/utils/travel-port-parsers/parser-travelport-flights"
import simpleDedent from "@/support/simple-dedent"

describe("web/src/utils/travel-port-parsers/parser-travel-port-flights.js", () => {
  describe(".parseTravelportFlights", () => {
    test("when given clean example data, parses it correctly", () => {
      const text = simpleDedent(`
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
      `)
      const result = parseTravelportFlights(text)

      expect(result).toEqual([
        {
          airline: "Air Canada",
          arrivalAirport: "Vancouver Intl Arpt",
          arrivalAirportCode: "YVR",
          arrivalDate: "13 Jan",
          arrivalTime: "11:53",
          arrivalTerminal: "M",
          class: "Q",
          departureAirport: "Pierre Elliott Trudeau Intl Arpt",
          departureAirportCode: "YUL",
          departureDate: "13 Jan",
          departureTime: "09:05",
          duration: "5 Hour(s) 48 Minutes",
          flightNumber: "AC303",
          status: "Confirmed",
        },
        {
          airline: "Air Canada",
          arrivalAirport: "Vancouver Intl Arpt",
          arrivalAirportCode: "YVR",
          arrivalDate: "13 Jan",
          arrivalTime: "11:53",
          arrivalTerminal: "M",
          class: "Q",
          departureAirport: "Pierre Elliott Trudeau Intl Arpt",
          departureAirportCode: "YUL",
          departureDate: "13 Jan",
          departureTime: "09:05",
          duration: "5 Hour(s) 48 Minutes",
          flightNumber: "AC304",
          status: "Confirmed",
        },
      ])
    })

    test("when given dirty example data, parses it correctly", () => {
      const text = simpleDedent(`
        Air North 4N521
        Departure:         25 Nov 10:45    Whitehorse Arpt (YXY)  Terminal:
        Arrival:                 25 Nov 12:00    Vancouver Intl Arpt (YVR)           Terminal: M
        Duration:            1 Hour(s) 15 Minutes
        Status:                 Confirmed (Passive)
        Class:                   Y

        Air Canada AC118
        Departure:         25 Nov 14:00    Vancouver Intl Arpt (YVR)           Terminal: M
        Arrival:                 25 Nov 21:26    Lester B Pearson Intl (YYZ)         Terminal: 1
        Duration:            4 Hour(s) 26 Minutes
        Status:                 Sold
        Class:                   S

        Air Canada AC105
        Departure:         30 Nov 09:45    Lester B Pearson Intl (YYZ)         Terminal: 1
        Arrival:                 30 Nov 11:49    Vancouver Intl Arpt (YVR)           Terminal: M
        Duration:            5 Hour(s) 4 Minutes
        Status:                 Sold
        Class:                   L

        Air North 4N540
        Departure:         30 Nov 14:30    Vancouver Intl Arpt (YVR)           Terminal: M
        Arrival:                 30 Nov 17:55    Whitehorse Arpt (YXY)  Terminal:
        Duration:            3 Hour(s) 25 Minutes
        Status:                 Confirmed (Passive)
        Class:                   Y
      `)

      const result = parseTravelportFlights(text)

      expect(result).toEqual([
        {
          airline: "Air North",
          arrivalAirport: "Vancouver Intl Arpt",
          arrivalAirportCode: "YVR",
          arrivalDate: "25 Nov",
          arrivalTime: "12:00",
          arrivalTerminal: "M",
          class: "Y",
          departureAirport: "Whitehorse Arpt",
          departureAirportCode: "YXY",
          departureDate: "25 Nov",
          departureTime: "10:45",
          duration: "1 Hour(s) 15 Minutes",
          flightNumber: "4N521",
          status: "Confirmed (Passive)",
        },
        {
          airline: "Air Canada",
          arrivalAirport: "Lester B Pearson Intl",
          arrivalAirportCode: "YYZ",
          arrivalDate: "25 Nov",
          arrivalTime: "21:26",
          arrivalTerminal: "1",
          class: "S",
          departureAirport: "Vancouver Intl Arpt",
          departureAirportCode: "YVR",
          departureDate: "25 Nov",
          departureTime: "14:00",
          departureTerminal: "M",
          duration: "4 Hour(s) 26 Minutes",
          flightNumber: "AC118",
          status: "Sold",
        },
        {
          airline: "Air Canada",
          arrivalAirport: "Vancouver Intl Arpt",
          arrivalAirportCode: "YVR",
          arrivalDate: "30 Nov",
          arrivalTime: "11:49",
          arrivalTerminal: "M",
          class: "L",
          departureAirport: "Lester B Pearson Intl",
          departureAirportCode: "YYZ",
          departureDate: "30 Nov",
          departureTime: "09:45",
          departureTerminal: "1",
          duration: "5 Hour(s) 4 Minutes",
          flightNumber: "AC105",
          status: "Sold",
        },
        {
          airline: "Air North",
          arrivalAirport: "Whitehorse Arpt",
          arrivalAirportCode: "YXY",
          arrivalDate: "30 Nov",
          arrivalTime: "17:55",
          class: "Y",
          departureAirport: "Vancouver Intl Arpt",
          departureAirportCode: "YVR",
          departureDate: "30 Nov",
          departureTime: "14:30",
          departureTerminal: "M",
          duration: "3 Hour(s) 25 Minutes",
          flightNumber: "4N540",
          status: "Confirmed (Passive)",
        },
      ])
    })
  })
})
