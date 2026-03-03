import { useMemo, useState } from "react";
import { FlatList, Platform, useWindowDimensions } from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getPeoplePage } from "@repo/api";
import { Button, H1, Paragraph, YStack, XStack } from "@repo/ui";

interface ProductListScreenProps {
  title?: string;
  onGoBack: () => void;
}

export function ProductListScreen({ title, onGoBack }: ProductListScreenProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const [webCurrentPage, setWebCurrentPage] = useState(1);

  const {
    data: webData,
    isLoading: isWebLoading,
    isError: isWebError,
  } = useQuery({
    queryKey: ["swapi-people-web", webCurrentPage],
    queryFn: () => getPeoplePage(webCurrentPage),
    enabled: isWeb,
  });

  const {
    data,
    isLoading: isMobileLoading,
    isError: isMobileError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["swapi-people"],
    queryFn: ({ pageParam }) => getPeoplePage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: !isWeb,
  });

  const mobilePeople = useMemo(
    () => data?.pages.flatMap((page) => page.people) ?? [],
    [data?.pages],
  );

  const people = isWeb ? (webData?.people ?? []) : mobilePeople;
  const currentPage = isWeb ? webCurrentPage : (data?.pages.length ?? 1);
  const nextPage = webData?.nextPage ?? null;
  const previousPage = webData?.previousPage ?? null;
  const isLoading = isWeb ? isWebLoading : isMobileLoading;
  const isError = isWeb ? isWebError : isMobileError;

  const numColumns = isWeb ? (width >= 1200 ? 4 : width >= 900 ? 3 : 2) : 1;

  return (
    <YStack
      flex={1}
      alignItems="stretch"
      padding="$6"
      gap="$4"
      width="100%"
      maxWidth={1100}
      alignSelf="center"
    >
      <H1>{title ?? "Product List"}</H1>

      <Paragraph>Loaded pages: {currentPage}</Paragraph>

      {isLoading ? <Paragraph>Loading...</Paragraph> : null}
      {isError ? (
        <Paragraph>Unable to load people. Please try again.</Paragraph>
      ) : null}

      {!isError ? (
        <FlatList
          key={`people-grid-${numColumns}`}
          data={people}
          numColumns={numColumns}
          keyExtractor={(item) => item.name}
          onEndReachedThreshold={isWeb ? undefined : 0.5}
          onEndReached={
            isWeb
              ? undefined
              : () => {
                  if (hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                  }
                }
          }
          contentContainerStyle={{ paddingBottom: 8 }}
          renderItem={({ item }) => (
            <YStack
              flex={1}
              margin={6}
              padding="$4"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$4"
              backgroundColor="$background"
              justifyContent="center"
              minHeight={isWeb ? undefined : 72}
              aspectRatio={isWeb ? 1 : undefined}
            >
              <Paragraph>{item.name}</Paragraph>
            </YStack>
          )}
          ListEmptyComponent={
            !isLoading ? <Paragraph>No records found.</Paragraph> : null
          }
          ListFooterComponent={
            isWeb ? null : (
              <YStack paddingVertical="$2">
                {isFetchingNextPage ? (
                  <Paragraph>Loading more...</Paragraph>
                ) : null}
                {!hasNextPage && people.length > 0 ? (
                  <Paragraph>No more records</Paragraph>
                ) : null}
              </YStack>
            )
          }
        />
      ) : null}

      {isWeb ? (
        <XStack gap="$2" width="100%">
          <Button
            width="50%"
            onPress={() => {
              if (previousPage) {
                setWebCurrentPage(previousPage);
              }
            }}
            disabled={!previousPage || isLoading}
          >
            Previous Page
          </Button>
          <Button
            width="50%"
            onPress={() => {
              if (nextPage) {
                setWebCurrentPage(nextPage);
              }
            }}
            disabled={!nextPage || isLoading}
          >
            Next Page
          </Button>
        </XStack>
      ) : null}

      <Button onPress={onGoBack}>Go Back</Button>
    </YStack>
  );
}
