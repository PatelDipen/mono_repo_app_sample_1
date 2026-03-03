import { useQuery } from "@tanstack/react-query";
import { getPersonById } from "@repo/api";
import { Button, H1, Paragraph, YStack } from "@repo/ui";

interface TodoListScreenProps {
  onGoBack: () => void;
}

export function TodoListScreen({ onGoBack }: TodoListScreenProps) {
  return (
    <YStack flex={1} alignItems="stretch" padding="$6" gap="$4" width="100%">
      <Paragraph>TODO List</Paragraph>

      <Button size="$5" onPress={onGoBack}>
        Go Back
      </Button>
    </YStack>
  );
}
