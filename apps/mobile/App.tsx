import {
  Button,
  H1,
  Paragraph,
  TamaguiProvider,
  Theme,
  YStack,
  tamaguiConfig,
} from "@repo/ui";

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Theme name="light">
        <YStack
          flex={1}
          alignItems="center"
          justifyContent="center"
          gap="$4"
          padding="$6"
        >
          <H1>Expo + Tamagui</H1>
          <Paragraph>Shared UI package from monorepo</Paragraph>
          <Button>Mobile App</Button>
        </YStack>
      </Theme>
    </TamaguiProvider>
  );
}
