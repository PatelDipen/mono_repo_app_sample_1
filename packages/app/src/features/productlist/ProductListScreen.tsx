import { useMemo } from "react";
import { FlatList } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPeoplePage } from "@repo/api";
import { Button, H1, Paragraph, YStack } from "@repo/ui";

interface ProductListScreenProps {
  title?: string;
  onGoBack: () => void;
}

export function ProductListScreen({ title, onGoBack }: ProductListScreenProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["swapi-people"],
    queryFn: ({ pageParam }) => getPeoplePage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  const people = useMemo(
    () => data?.pages.flatMap((page) => page.people) ?? [],
    [data?.pages],
  );

  const currentPage = data?.pages.length ?? 1;

  return (
    <YStack flex={1} alignItems="stretch" padding="$6" gap="$4">
      <H1>{title ?? "Product List"}</H1>

      <Paragraph>Loaded pages: {currentPage}</Paragraph>

      {isLoading ? <Paragraph>Loading...</Paragraph> : null}
      {isError ? (
        <Paragraph>Unable to load people. Please try again.</Paragraph>
      ) : null}

      {!isError ? (
        <FlatList
          data={people}
          keyExtractor={(item) => item.name}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              void fetchNextPage();
            }
          }}
          renderItem={({ item }) => <Paragraph>{item.name}</Paragraph>}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Paragraph>Loading more...</Paragraph>
            ) : !hasNextPage && people.length > 0 ? (
              <Paragraph>No more records</Paragraph>
            ) : null
          }
        />
      ) : null}

      <Button onPress={onGoBack}>Go Back</Button>
    </YStack>
  );
}
