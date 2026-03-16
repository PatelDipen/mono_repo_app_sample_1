# Monorepo Architecture

## Why this structure

The repository separates platform runtimes (`apps/*`) from reusable product logic (`packages/*`).
This keeps business features and UI components shared while allowing mobile and web to have independent entry points.

## Dependency Direction

Expected import direction:

1. `apps/*` can depend on `packages/*`
2. `packages/app` can depend on `packages/ui` and `packages/api`
3. `packages/ui` and `packages/api` should remain independent from app runtime concerns

Avoid reversing this direction (for example, `packages/*` importing from `apps/*`).

## Runtime Responsibilities

- `apps/mobile`: native entry points, Expo tooling, mobile route mounting
- `apps/web`: browser entry point, Vite tooling, web route mounting
- `packages/app`: feature modules, app-level providers, navigation types, state helpers
- `packages/ui`: reusable primitives and visual system setup
- `packages/api`: HTTP clients and domain API wrappers

## Feature Placement Guide

- Add business features under `packages/app/src/features/*`
- Add API integrations under `packages/api/src/*`
- Add reusable view primitives under `packages/ui/src/*`
- Keep screen composition inside route files in `apps/mobile/src/routes/*` and `apps/web/src/routes/*`

## Build and Validation

Run from repository root:

```bash
npm run typecheck
npm run build:web
```

Use app-level scripts for runtime testing:

```bash
npm run dev:mobile
npm run dev:web
```
