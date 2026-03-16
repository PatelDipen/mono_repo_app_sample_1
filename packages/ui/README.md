# @repo/ui

Shared UI package for reusable components and design system configuration.

## Responsibilities

- Hosts cross-platform UI primitives
- Maintains Tamagui setup and visual tokens
- Provides consistent building blocks to `@repo/app`, web, and mobile

## Structure

- `src/primitives.tsx`: core reusable UI primitives
- `src/tamagui.config.ts`: Tamagui configuration
- `src/index.ts`: package exports

## Dependency Rules

- Keep this package presentational and composable.
- Avoid embedding business logic here.
- Do not import from `apps/*`.

## Guidance

- Add primitives that solve repeated UI patterns across apps.
- Keep component props typed and minimal.
- Export stable primitives from `src/index.ts` for consumer simplicity.
