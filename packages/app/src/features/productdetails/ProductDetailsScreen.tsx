import { useQuery } from "@tanstack/react-query";
import { getPersonById } from "@repo/api";
import {
  AppScreen,
  Button,
  H1,
  MutedText,
  Paragraph,
  ScreenActions,
  ScreenHeader,
  SurfaceCard,
} from "@repo/ui";

interface ProductDetailsScreenProps {
  id: string;
  onGoBack: () => void;
}

export function ProductDetailsScreen({
  id,
  onGoBack,
}: ProductDetailsScreenProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["swapi-person", id],
    queryFn: () => getPersonById(id),
    enabled: Boolean(id),
  });

  return (
    <AppScreen>
      <ScreenHeader>
        <H1>Product Details</H1>
        <MutedText>ID: {id}</MutedText>
      </ScreenHeader>

      {isLoading ? <MutedText>Loading details...</MutedText> : null}
      {isError ? (
        <MutedText>Unable to load person details. Please try again.</MutedText>
      ) : null}

      {data ? (
        <SurfaceCard
          gap="$2"
          borderColor="$borderColor"
          borderRadius="$4"
          padding="$4"
        >
          <Paragraph>Name: {data.name}</Paragraph>
          <Paragraph>Height: {data.height}</Paragraph>
          <Paragraph>Mass: {data.mass}</Paragraph>
          <Paragraph>Gender: {data.gender}</Paragraph>
          <Paragraph>Birth Year: {data.birth_year}</Paragraph>
          <Paragraph>Eye Color: {data.eye_color}</Paragraph>
          <Paragraph>Hair Color: {data.hair_color}</Paragraph>
          <Paragraph>Skin Color: {data.skin_color}</Paragraph>
        </SurfaceCard>
      ) : null}

      <ScreenActions>
        <Button size="$5" onPress={onGoBack}>
          Go Back
        </Button>
      </ScreenActions>
    </AppScreen>
  );
}
