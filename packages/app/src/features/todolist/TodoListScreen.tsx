import { useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";
import {
  AppScreen,
  Button,
  H1,
  Input,
  MutedText,
  Paragraph,
  ScreenActions,
  ScreenHeader,
  SectionLabel,
  SurfaceCard,
  XStack,
  YStack,
} from "@repo/ui";
import { type TodoStatus, useTodoStore } from "./todoStore";

interface TodoListScreenProps {
  onGoBack: () => void;
}

const STATUS_TITLES: Record<TodoStatus, string> = {
  todo: "Current Todo List",
  inprogress: "In Progress List",
  completed: "Completed List",
};

const ALL_STATUSES: TodoStatus[] = ["todo", "inprogress", "completed"];

function getNextStatus(current: TodoStatus): TodoStatus {
  if (current === "todo") {
    return "inprogress";
  }

  if (current === "inprogress") {
    return "completed";
  }

  return "todo";
}

export function TodoListScreen({ onGoBack }: TodoListScreenProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isWideWeb = isWeb && width >= 980;
  const [title, setTitle] = useState("");

  const todos = useTodoStore((state) => state.todos);
  const isLoading = useTodoStore((state) => state.isLoading);
  const error = useTodoStore((state) => state.error);
  const loadTodos = useTodoStore((state) => state.loadTodos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const updateTodoStatus = useTodoStore((state) => state.updateTodoStatus);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const todosByStatus = useMemo(
    () => ({
      todo: todos.filter((todo) => todo.status === "todo"),
      inprogress: todos.filter((todo) => todo.status === "inprogress"),
      completed: todos.filter((todo) => todo.status === "completed"),
    }),
    [todos],
  );

  async function handleAddTodo() {
    await addTodo(title);
    setTitle("");
  }

  async function handleClearCompleted() {
    await clearCompleted();
  }

  const completedCount = todosByStatus.completed.length;

  const SectionWrapper = isWideWeb ? XStack : YStack;
  const sections = ALL_STATUSES.map((status) => (
    <SurfaceCard key={status} flex={isWideWeb ? 1 : undefined} minHeight={220}>
      <SectionLabel>{STATUS_TITLES[status]}</SectionLabel>
      {todosByStatus[status].length === 0 ? (
        <MutedText>No items</MutedText>
      ) : (
        todosByStatus[status].map((todo) => {
          const nextStatus = getNextStatus(todo.status);

          return (
            <SurfaceCard key={todo.id} borderRadius="$3" padding="$2" gap="$2">
              <Paragraph>{todo.title}</Paragraph>
              <XStack gap="$2" flexWrap="wrap">
                <Button
                  size="$2"
                  onPress={() => {
                    void updateTodoStatus(todo.id, nextStatus);
                  }}
                >
                  Move to {STATUS_TITLES[nextStatus]}
                </Button>
                <Button
                  size="$2"
                  theme="red"
                  onPress={() => {
                    void deleteTodo(todo.id);
                  }}
                >
                  Delete
                </Button>
              </XStack>
            </SurfaceCard>
          );
        })
      )}
    </SurfaceCard>
  ));

  return (
    <AppScreen>
      <ScreenHeader>
        <H1>TODO List</H1>
      </ScreenHeader>

      <XStack gap="$2" width="100%" alignItems="center">
        <Input
          flex={1}
          size="$4"
          placeholder="Enter todo title"
          value={title}
          onChangeText={setTitle}
        />
        <Button size="$4" onPress={handleAddTodo} disabled={!title.trim()}>
          Add
        </Button>
        <Button
          size="$4"
          theme="red"
          onPress={handleClearCompleted}
          disabled={completedCount === 0}
          opacity={completedCount === 0 ? 0.6 : 1}
        >
          Clear Completed
        </Button>
      </XStack>

      {isLoading ? <MutedText>Loading todos...</MutedText> : null}
      {error ? <MutedText color="$red10">{error}</MutedText> : null}

      {isWideWeb ? (
        <SectionWrapper gap="$3" width="100%" flex={1} alignItems="stretch">
          {sections}
        </SectionWrapper>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          <SectionWrapper gap="$3" width="100%" alignItems="stretch">
            {sections}
          </SectionWrapper>
        </ScrollView>
      )}

      <ScreenActions>
        <Button size="$5" onPress={onGoBack}>
          Go Back
        </Button>
      </ScreenActions>
    </AppScreen>
  );
}
