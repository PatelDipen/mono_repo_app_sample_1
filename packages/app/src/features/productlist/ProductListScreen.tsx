import { useEffect, useMemo, useState } from "react";
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
import {
  AppScreen,
  Button,
  H1,
  Input,
  MutedText,
  Paragraph,
  ScreenActions,
  ScreenHeader,
  SurfaceCard,
  XStack,
  YStack,
} from "@repo/ui";

interface ProductListScreenProps {
  title?: string;
  onGoBack: () => void;
  onNavigateToProductDetails: (id: string) => void;
  initialWebPage?: number;
  onWebPageChange?: (page: number) => void;
}

interface ProductCardProps {
  person: SwapiPerson;
  index: number;
  onNavigateToProductDetails: (id: string) => void;
}

const CARD_ACCENTS = ["blue", "green", "purple", "orange", "pink"] as const;

function getCardAccent(index: number) {
  return CARD_ACCENTS[index % CARD_ACCENTS.length];
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
  const cardAccent = getCardAccent(index);

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
        <SurfaceCard
          flex={1}
          padding="$4"
          emphasis="medium"
          accent={cardAccent}
          justifyContent="center"
          minHeight={120}
        >
          <Paragraph>{person.name}</Paragraph>
        </SurfaceCard>
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
  const cardAccent = getCardAccent(index);

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
        <SurfaceCard
          flex={1}
          padding="$4"
          emphasis="medium"
          accent={cardAccent}
          justifyContent="center"
          minHeight={72}
        >
          <Paragraph>{person.name}</Paragraph>
        </SurfaceCard>
      </Animated.View>
    </Pressable>
  );
}

export function ProductListScreen({
  title,
  onGoBack,
  onNavigateToProductDetails,
  initialWebPage,
  onWebPageChange,
}: ProductListScreenProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const [webCurrentPage, setWebCurrentPage] = useState(initialWebPage ?? 1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isWeb) {
      return;
    }

    const normalizedPage =
      initialWebPage && initialWebPage > 0 ? Math.floor(initialWebPage) : 1;

    setWebCurrentPage((previousPage) =>
      previousPage === normalizedPage ? previousPage : normalizedPage,
    );
  }, [initialWebPage, isWeb]);

  function setCurrentWebPage(page: number) {
    setWebCurrentPage(page);
    onWebPageChange?.(page);
  }

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
  const filteredPeople = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return people;
    }

    return people.filter((person) =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [people, searchQuery]);
  const currentPage = isWeb ? webCurrentPage : (data?.pages.length ?? 1);
  const nextPage = webData?.nextPage ?? null;
  const previousPage = webData?.previousPage ?? null;
  const isLoading = isWeb ? isWebLoading : isMobileLoading;
  const isError = isWeb ? isWebError : isMobileError;
  const canGoPrevious = Boolean(previousPage) && !isLoading;
  const canGoNext = Boolean(nextPage) && !isLoading;

  const numColumns = isWeb ? (width >= 1200 ? 4 : width >= 900 ? 3 : 2) : 1;

  return (
    <AppScreen>
      <ScreenHeader>
        <H1>{title ?? "Product List"}</H1>
        <MutedText>Loaded pages: {currentPage}</MutedText>
      </ScreenHeader>

      <Input
        size="$4"
        placeholder="Search products"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {isLoading ? <MutedText>Loading...</MutedText> : null}
      {isError ? (
        <MutedText>Unable to load people. Please try again.</MutedText>
      ) : null}

      {!isError ? (
        <YStack flex={1}>
          <FlatList
            key={`people-grid-${numColumns}`}
            data={filteredPeople}
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
              !isLoading ? (
                <MutedText>
                  {searchQuery.trim()
                    ? "No matching records."
                    : "No records found."}
                </MutedText>
              ) : null
            }
            ListFooterComponent={
              isWeb ? null : (
                <YStack paddingVertical="$2">
                  {isFetchingNextPage ? (
                    <MutedText>Loading more...</MutedText>
                  ) : null}
                  {!hasNextPage && people.length > 0 ? (
                    <MutedText>No more records</MutedText>
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
                  setCurrentWebPage(previousPage);
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
                  setCurrentWebPage(nextPage);
                }
              }}
              disabled={!canGoNext}
            >
              {canGoNext ? "Next Page" : "No Next Page"}
            </Button>
          </XStack>
        </YStack>
      ) : null}

      <ScreenActions>
        <Button size="$5" onPress={onGoBack}>
          Go Back
        </Button>
      </ScreenActions>
    </AppScreen>
  );
}
