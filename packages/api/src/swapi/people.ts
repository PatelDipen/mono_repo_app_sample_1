import { apiGet } from "../client";

const SWAPI_PEOPLE_BASE_URL = "https://swapi.dev/api/people";

export interface SwapiPerson {
  name: string;
}

export interface SwapiPeopleResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiPerson[];
}

export interface PeoplePageData {
  people: SwapiPerson[];
  totalCount: number;
  nextPage: number | null;
  previousPage: number | null;
}

export async function getPeoplePage(page: number): Promise<PeoplePageData> {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const data = await apiGet<SwapiPeopleResponse>(
    `${SWAPI_PEOPLE_BASE_URL}?page=${safePage}`,
  );

  return {
    people: data.results,
    totalCount: data.count,
    nextPage: getPageNumberFromUrl(data.next),
    previousPage: getPageNumberFromUrl(data.previous),
  };
}

function getPageNumberFromUrl(url: string | null): number | null {
  if (!url) {
    return null;
  }

  const match = url.match(/[?&]page=(\d+)/);

  if (!match?.[1]) {
    return null;
  }

  const pageNumber = Number(match[1]);
  return Number.isInteger(pageNumber) ? pageNumber : null;
}
