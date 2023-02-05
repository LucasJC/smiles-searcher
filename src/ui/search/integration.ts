import { FlightSearchResult } from "../models/flight-search-result";
import axios from "axios";
import moment from "moment";

const SMILES_API_URL = "https://api-air-flightsearch-prd.smiles.com.br/v1";

interface Airport {
    code: string,
    name: string,
    city: string,
    country: string
}

interface Flight {
    uid: string,
    stops: number,
    cabin: 'ECONOMIC' | string,
    availableSeats: number,
    departure: {
      date: string,
      airport: Airport
    },
    arrival: {
      date: string,
      airport: Airport
    },
    airline: {
      code: string,
      name: string
    },
    baggage: {
      free: boolean,
      quantity: number
    },
    durationNumber: number,
    duration: {
      hours: number,
      minutes: number
    },
    fareList: {
      type: 'SMILES_CLUB' | string,
      miles: number
    }[]
}

interface Segment {
    flightList?: Flight[],
    bestPricing?: {
        miles: number
    }
}

interface SmilesAPIResult {
    requestedFlightSegmentList?: Segment[],
    query?: string
}

async function searchAPI(opts: {
  people: number,
  departure: string,
  originAirport: string,
  destinationAirport: string
}): Promise<FlightSearchResult> {
  const url = `${SMILES_API_URL}/airlines/search?adults=${opts.people}&cabinType=all&children=0&currencyCode=ARS&departureDate=${opts.departure}&destinationAirportCode=${opts.destinationAirport}&infants=0&isFlexibleDateChecked=false&originAirportCode=${opts.originAirport}&tripType=2&forceCongener=true&r=ar`;
  const response = await axios.get<SmilesAPIResult>(url, {
      withCredentials: false,
      headers: {
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3",
          "Region": "ARGENTINA",
          "Language": "es-ES",
          "Channel": "Web",
          "x-api-key": "aJqPU7xNHl9qN3NVZnPaJ208aPo2Bh2p2ZV844tw",
      }
  });
  const dateInMillis = moment(opts.departure, "YYYY-MM-DD").valueOf();
  const query = `https://www.smiles.com.ar/emission?adults=${opts.people}&cabinType=all&children=0&currencyCode=ARS&departureDate=${dateInMillis}&destinationAirportCode=${opts.destinationAirport}&infants=0&isFlexibleDateChecked=false&originAirportCode=${opts.originAirport}&tripType=2&forceCongener=true&r=ar`;
  const result = response.data;
  return {
    origin: opts.originAirport,
    destination: opts.destinationAirport,
    departure: opts.departure,
    miles: result.requestedFlightSegmentList[0]?.bestPricing?.miles || -1,
    count: result.requestedFlightSegmentList[0]?.flightList?.length || -1,
    query
  };
}

function singleDestinationSearch(currentDate: moment.Moment, destinations: string[], people: number, origin: string) {
  return destinations.map(destination => searchAPI({
    people: people,
    departure: currentDate.format("YYYY-MM-DD"),
    originAirport: origin,
    destinationAirport: destination,
  }));
}

export async function multipleDestinationSearch(origin: string, destinations: string[], from: moment.Moment, to: moment.Moment, people: number): Promise<FlightSearchResult[]> {
  const days = to.diff(from, 'days') + 1;
  console.log('Days to calculate:', days);
  const promises: Promise<FlightSearchResult>[] = [];
  let currentDate = from;
  for (let index = 0; index < days; index++) {
      promises.push(...singleDestinationSearch(currentDate, destinations, people, origin));
      currentDate = currentDate.add(1, 'days');
  }
  return (await Promise.all(promises))
      .filter(r => r.miles)
      .sort((a, b) => a.miles-b.miles);
}