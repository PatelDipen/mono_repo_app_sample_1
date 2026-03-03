import { useQuery } from "@tanstack/react-query";
import { getPersonById } from "@repo/api";
import { Button, H1, Paragraph, YStack } from "@repo/ui";

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
    <YStack flex={1} alignItems="stretch" padding="$6" gap="$4" width="100%">
      <Paragraph>ID: {id}</Paragraph>

      {isLoading ? <Paragraph>Loading details...</Paragraph> : null}
      {isError ? (
        <Paragraph>Unable to load person details. Please try again.</Paragraph>
      ) : null}

      {data ? (
        <YStack
          gap="$2"
          borderWidth={1}
          borderColor={data.eye_color}
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
        </YStack>
      ) : null}

      <Button size="$5" onPress={onGoBack}>
        Go Back
      </Button>
    </YStack>
  );
}
