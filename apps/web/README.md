# @repo/web

Web runtime shell built with Vite and React.

## Responsibilities

- Provides browser entry point and Vite runtime config
- Defines web route-level screens in `src/routes/*`
- Composes shared features from `@repo/app` and shared UI from `@repo/ui`

## Local Scripts

Run from repository root:

- `npm run dev:web`
- `npm run build:web`

Run from this folder:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`

## Directory Notes

- `src/main.tsx`: browser bootstrap
- `src/App.tsx`: app container
- `src/routes/*`: route screens for web navigation
- `vite.config.ts`: bundler setup

## Development Guidance

- Build features in `packages/app` first when behavior should be shared.
- Keep web-only wiring in this app package.
- Reuse `@repo/ui` primitives for consistent cross-platform styling.
