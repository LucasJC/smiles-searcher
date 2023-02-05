export interface FlightSearchResult {
    origin: string,
    destination: string,
    departure: string,
    miles?: number,
    count?: number,
    query?: string
}