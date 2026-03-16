# @repo/api

Shared API client package for remote data access.

## Responsibilities

- Centralizes HTTP client configuration
- Provides domain-specific API wrappers
- Encapsulates third-party service details from app feature code

## Structure

- `src/client.ts`: shared HTTP client setup
- `src/openweather/weather.ts`: weather-related API calls
- `src/swapi/people.ts`: Star Wars API calls
- `src/index.ts`: package exports

## Dependency Rules

- Keep this package framework-agnostic where possible.
- Do not import from `apps/*`.
- Prefer typed request/response contracts in exported methods.

## Guidance

- Add new integrations under a dedicated folder in `src/`.
- Keep retry/error handling decisions explicit at this boundary.
- Expose small, testable functions instead of large API classes.
