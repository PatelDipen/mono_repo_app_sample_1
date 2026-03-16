# @repo/app

Shared application layer used by both mobile and web runtimes.

## Responsibilities

- Exposes feature modules from `src/features/*`
- Holds app-level providers in `src/providers/*`
- Defines navigation contracts in `src/navigation/*`
- Hosts shared state utilities in `src/state/*`

## Structure

- `src/index.ts`: public exports for consumers
- `src/features/*`: domain features (home, tickets, weather, etc.)
- `src/providers/AppQueryProvider.tsx`: shared query client/provider setup
- `src/navigation/types.ts`: typed navigation contracts

## Dependency Rules

- Can depend on `@repo/ui` and `@repo/api`
- Must not depend on `apps/*`
- Keep platform-specific code out of this package

## Guidance

- New cross-platform feature logic belongs here first.
- Keep exported API surface deliberate and typed.
- Avoid leaking internals; export only stable module entry points.
