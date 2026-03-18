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
export type { TodoApiStatus, TodoApiItem } from "./todos";
export { searchCities, getCityForecast } from "./openweather/weather";
export { getPeoplePage, getPersonById } from "./swapi/people";
export { getTodos, addTodo, updateTodo, deleteTodo } from "./todos";
