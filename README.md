# mono_repo_sample_1

A TypeScript monorepo with shared app, UI, and API packages consumed by mobile and web apps.

## Workspace Layout

- `apps/mobile`: Expo + React Native app shell
- `apps/web`: Vite + React app shell
- `packages/app`: shared features, providers, and navigation contracts
- `packages/ui`: shared UI primitives and Tamagui config
- `packages/api`: shared API clients and services
- `docs/`: architecture and operational documentation

## Quick Start

```bash
npm install
npm run dev:web
```

For mobile:

```bash
npm run dev:mobile
```

## Common Scripts (root)

- `npm run dev:web`
- `npm run dev:mobile`
- `npm run ios`
- `npm run android`
- `npm run build:web`
- `npm run typecheck`
- `npm run clean:install`

## Documentation Map

- `docs/monorepo-architecture.md`
- `apps/mobile/README.md`
- `apps/web/README.md`
- `packages/app/README.md`
- `packages/api/README.md`
- `packages/ui/README.md`
