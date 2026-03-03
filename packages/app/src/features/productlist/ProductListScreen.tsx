import { Button, H1, Paragraph, YStack } from "@repo/ui";

interface ProductListScreenProps {
  title?: string;
  onGoBack: () => void;
}

export function ProductListScreen({ title, onGoBack }: ProductListScreenProps) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="$4"
      padding="$6"
    >
      <H1>{title ?? "Product List"}</H1>
      <Paragraph>This is the product list screen.</Paragraph>
      <Button onPress={onGoBack}>Go Back</Button>
    </YStack>
  );
}
