import { Button, H1, Paragraph, YStack } from "@repo/ui";

interface HomeScreenProps {
  onNavigateToProductList: () => void;
  onNavigateToTodoList: () => void;
  onNavigateToWeather: () => void;
}

export function HomeScreen({
  onNavigateToProductList,
  onNavigateToTodoList,
  onNavigateToWeather,
}: HomeScreenProps) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      //   justifyContent="center"
      gap="$4"
      padding="$6"
    >
      <H1>Home</H1>
      <Paragraph>Welcome to the app!</Paragraph>

      <Button
        size="$5"
        width="100%"
        maxWidth={320}
        borderRadius="$6"
        backgroundColor={"$blue6"}
        onPress={onNavigateToProductList}
      >
        Go to Product List
      </Button>

      <Button
        size="$5"
        width="100%"
        maxWidth={320}
        borderRadius="$6"
        backgroundColor={"$blue6"}
        onPress={onNavigateToTodoList}
      >
        Go to TODO List
      </Button>

      <Button
        size="$5"
        width="100%"
        maxWidth={320}
        borderRadius="$6"
        backgroundColor={"$blue6"}
        onPress={onNavigateToWeather}
      >
        Go To Weather
      </Button>
    </YStack>
  );
}
