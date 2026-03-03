import { Button, H1, Paragraph, YStack } from "@repo/ui";

interface HomeScreenProps {
  onNavigateToProductList: () => void;
}

export function HomeScreen({ onNavigateToProductList }: HomeScreenProps) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="$4"
      padding="$6"
    >
      <H1>Home</H1>
      <Paragraph>Welcome to the app!</Paragraph>
      <Button onPress={onNavigateToProductList}>Go to Product List</Button>
    </YStack>
  );
}
