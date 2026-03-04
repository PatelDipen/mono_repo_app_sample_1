export type { ApiError } from "./client";
export type {
  OpenWeatherCity,
  ForecastItem,
  CityForecast,
} from "./openweather/weather";
export type {
  SwapiPerson,
  SwapiPersonDetails,
  PeoplePageData,
} from "./swapi/people";
export { searchCities, getCityForecast } from "./openweather/weather";
export { getPeoplePage, getPersonById } from "./swapi/people";
