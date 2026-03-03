import { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { getPeoplePage, type SwapiPerson } from "@repo/api";
import { Button, H1, Paragraph, YStack, XStack } from "@repo/ui";

interface ProductListScreenProps {
  title?: string;
  onGoBack: () => void;
  onNavigateToProductDetails: (id: string) => void;
}

interface ProductCardProps {
  person: SwapiPerson;
  index: number;
  onNavigateToProductDetails: (id: string) => void;
}

const CARD_BORDER_COLORS = [
  "$blue8",
  "$green8",
  "$purple8",
  "$orange8",
  "$pink8",
] as const;

function getCardBorderColor(index: number) {
  return CARD_BORDER_COLORS[index % CARD_BORDER_COLORS.length];
}

function WebProductCard({
  person,
  index,
  onNavigateToProductDetails,
}: {
  person: SwapiPerson;
  index: number;
  onNavigateToProductDetails: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardBorderColor = getCardBorderColor(index);

  return (
    <Pressable
      style={({ pressed }) => ({
        flex: 1,
        margin: 6,
        transform: [{ scale: isHovered || pressed ? 0.99 : 1 }],
      })}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={() =>
        onNavigateToProductDetails(person.url.split("/").slice(-2, -1)[0])
      }
    >
      <Animated.View
        entering={FadeInUp.duration(220).delay((index % 8) * 25)}
        style={{ flex: 1 }}
      >
        <YStack
          flex={1}
          padding="$4"
          borderWidth={2}
          borderColor={cardBorderColor}
          borderRadius="$4"
          backgroundColor="$background"
          justifyContent="center"
          minHeight={120}
        >
          <Paragraph>{person.name}</Paragraph>
        </YStack>
      </Animated.View>
    </Pressable>
  );
}

function MobileProductCard({
  person,
  index,
  onNavigateToProductDetails,
}: ProductCardProps) {
  const cardScale = useSharedValue(1);
  const cardBorderColor = getCardBorderColor(index);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <Pressable
      style={{ flex: 1, margin: 6 }}
      onPressIn={() => {
        cardScale.value = withSpring(0.97, {
          damping: 15,
          stiffness: 220,
        });
      }}
      onPressOut={() => {
        cardScale.value = withSpring(1, {
          damping: 15,
          stiffness: 220,
        });
      }}
      onPress={() =>
        onNavigateToProductDetails(person.url.split("/").slice(-2, -1)[0])
      }
    >
      <Animated.View
        entering={FadeInUp.duration(260).delay((index % 8) * 35)}
        style={[{ flex: 1 }, animatedStyle]}
      >
        <YStack
          flex={1}
          padding="$4"
          borderWidth={2}
          borderColor={cardBorderColor}
          borderRadius="$4"
          backgroundColor="$background"
          justifyContent="center"
          minHeight={72}
        >
          <Paragraph>{person.name}</Paragraph>
        </YStack>
      </Animated.View>
    </Pressable>
  );
}

export function ProductListScreen({
  title,
  onGoBack,
  onNavigateToProductDetails,
}: ProductListScreenProps) {
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
  const canGoPrevious = Boolean(previousPage) && !isLoading;
  const canGoNext = Boolean(nextPage) && !isLoading;

  const numColumns = isWeb ? (width >= 1200 ? 4 : width >= 900 ? 3 : 2) : 1;

  return (
    <YStack flex={1} alignItems="stretch" padding="$6" gap="$4" width="100%">
      <H1>{title ?? "Product List"}</H1>

      <Paragraph>Loaded pages: {currentPage}</Paragraph>

      {isLoading ? <Paragraph>Loading...</Paragraph> : null}
      {isError ? (
        <Paragraph>Unable to load people. Please try again.</Paragraph>
      ) : null}

      {!isError ? (
        <YStack flex={1}>
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
            renderItem={({ item, index }) =>
              isWeb ? (
                <WebProductCard
                  person={item}
                  index={index}
                  onNavigateToProductDetails={(id) =>
                    onNavigateToProductDetails(id)
                  }
                />
              ) : (
                <MobileProductCard
                  person={item}
                  index={index}
                  onNavigateToProductDetails={(id) =>
                    onNavigateToProductDetails(id)
                  }
                />
              )
            }
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
        </YStack>
      ) : null}

      {isWeb ? (
        <YStack gap="$2" width="100%">
          <XStack gap="$2" width="100%">
            <Button
              width="50%"
              size="$5"
              opacity={canGoPrevious ? 1 : 0.6}
              onPress={() => {
                if (previousPage) {
                  setWebCurrentPage(previousPage);
                }
              }}
              disabled={!canGoPrevious}
            >
              {canGoPrevious ? "Previous Page" : "No Previous Page"}
            </Button>
            <Button
              width="50%"
              size="$5"
              opacity={canGoNext ? 1 : 0.6}
              onPress={() => {
                if (nextPage) {
                  setWebCurrentPage(nextPage);
                }
              }}
              disabled={!canGoNext}
            >
              {canGoNext ? "Next Page" : "No Next Page"}
            </Button>
          </XStack>
        </YStack>
      ) : null}

      <Button size="$5" onPress={onGoBack}>
        Go Back
      </Button>
    </YStack>
  );
}
