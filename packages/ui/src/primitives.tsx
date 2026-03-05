import { Button, Paragraph, YStack, styled } from "tamagui";

export const AppScreen = styled(YStack, {
  name: "AppScreen",
  flex: 1,
  alignItems: "stretch",
  width: "100%",
  padding: "$6",
  gap: "$4",
});

export const SurfaceCard = styled(YStack, {
  name: "SurfaceCard",
  borderWidth: 1,
  borderColor: "$borderColor",
  borderRadius: "$4",
  padding: "$3",
  gap: "$2",
  backgroundColor: "$background",
  variants: {
    emphasis: {
      low: {},
      medium: {
        borderWidth: 2,
      },
    },
    accent: {
      blue: { borderColor: "$blue8" },
      green: { borderColor: "$green8" },
      purple: { borderColor: "$purple8" },
      orange: { borderColor: "$orange8" },
      pink: { borderColor: "$pink8" },
    },
  } as const,
  defaultVariants: {
    emphasis: "low",
  },
});

export const SectionLabel = styled(Paragraph, {
  name: "SectionLabel",
  fontWeight: "700",
});

export const MutedText = styled(Paragraph, {
  name: "MutedText",
  color: "$gray10",
});

export const ListActionButton = styled(Button, {
  name: "ListActionButton",
  justifyContent: "flex-start",
});

export const ScreenHeader = styled(YStack, {
  name: "ScreenHeader",
  gap: "$1",
  width: "100%",
});

export const ScreenActions = styled(YStack, {
  name: "ScreenActions",
  gap: "$2",
  width: "100%",
});
