# @repo/mobile

Mobile runtime shell built with Expo and React Native.

## Responsibilities

- Bootstraps the native app runtime
- Defines mobile route-level screens in `src/routes/*`
- Composes shared features from `@repo/app` and shared UI from `@repo/ui`

## Local Scripts

Run from repository root:

- `npm run dev:mobile`
- `npm run ios`
- `npm run android`

Run from this folder:

- `npm run dev`
- `npm run ios`
- `npm run android`
- `npm run typecheck`

## Directory Notes

- `App.tsx` and `index.ts`: app entry points
- `src/routes/*`: route screens for mobile navigation
- `ios/` and `android/`: native projects generated/managed for Expo run workflows

## Development Guidance

- Keep product/business logic in `packages/app`.
- Keep reusable visual elements in `packages/ui`.
- Limit this app package to platform wiring and screen composition.
