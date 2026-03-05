import {
  AppScreen,
  Button,
  H1,
  MutedText,
  ScreenActions,
  ScreenHeader,
} from "@repo/ui";

interface HomeScreenProps {
  onNavigateToProductList: () => void;
  onNavigateToTodoList: () => void;
  onNavigateToTickets: () => void;
  onNavigateToWeather: () => void;
  onNavigateToUILibrary: () => void;
}

export function HomeScreen({
  onNavigateToProductList,
  onNavigateToTodoList,
  onNavigateToTickets,
  onNavigateToWeather,
  onNavigateToUILibrary,
}: HomeScreenProps) {
  const navButtonProps = {
    size: "$5" as const,
    width: "100%" as const,
    maxWidth: 320,
    borderRadius: "$6" as const,
    backgroundColor: "$blue6" as const,
  };

  return (
    <AppScreen alignItems="center">
      <ScreenHeader alignItems="center">
        <H1>Home</H1>
        <MutedText>Welcome to the app!</MutedText>
      </ScreenHeader>

      <ScreenActions alignItems="center">
        <Button {...navButtonProps} onPress={onNavigateToProductList}>
          Go to Product List
        </Button>

        <Button {...navButtonProps} onPress={onNavigateToTodoList}>
          Go to TODO List
        </Button>

        <Button {...navButtonProps} onPress={onNavigateToTickets}>
          Go to Tickets
        </Button>

        <Button {...navButtonProps} onPress={onNavigateToWeather}>
          Go To Weather
        </Button>

        <Button {...navButtonProps} onPress={onNavigateToUILibrary}>
          Go to UI Library
        </Button>
      </ScreenActions>
    </AppScreen>
  );
}
