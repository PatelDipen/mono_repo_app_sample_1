# Copilot Instructions for mono_repo_sample_1

## Project Intent

This repository is a TypeScript monorepo for a shared React Native + Web application stack.

- `apps/mobile`: Expo + React Native runtime shell
- `apps/web`: Vite + React web runtime shell
- `packages/app`: shared app features, routes, state, and providers
- `packages/ui`: shared UI primitives and design system config
- `packages/api`: shared API clients and integrations

## Workspace Rules

- Keep reusable logic in `packages/*`; keep platform-specific bootstrapping inside `apps/*`.
- Prefer adding features in `packages/app/src/features/*` and expose from `packages/app/src/index.ts`.
- Keep route-level screens thin in `apps/mobile/src/routes/*` and `apps/web/src/routes/*`.
- Use strong TypeScript typings at package boundaries.

## Commands (run from repo root)

- Install: `npm install`
- Mobile dev: `npm run dev:mobile`
- Web dev: `npm run dev:web`
- iOS: `npm run ios`
- Android: `npm run android`
- Web build: `npm run build:web`
- Typecheck all workspaces: `npm run typecheck`

## Change Guidance

- For cross-platform behavior, update shared code in `packages/app` first.
- For visual consistency, prefer `@repo/ui` primitives over ad-hoc styles.
- Keep API calls behind `@repo/api` clients; avoid direct network calls in route files.
- Document non-obvious architectural decisions in `docs/monorepo-architecture.md`.
