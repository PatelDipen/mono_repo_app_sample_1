import { useMemo, useState } from "react";
import { Platform, ScrollView, useWindowDimensions } from "react-native";
import { Button, H1, Input, Paragraph, XStack, YStack } from "@repo/ui";
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
  const addTodo = useTodoStore((state) => state.addTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const updateTodoStatus = useTodoStore((state) => state.updateTodoStatus);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  const todosByStatus = useMemo(
    () => ({
      todo: todos.filter((todo) => todo.status === "todo"),
      inprogress: todos.filter((todo) => todo.status === "inprogress"),
      completed: todos.filter((todo) => todo.status === "completed"),
    }),
    [todos],
  );

  function handleAddTodo() {
    addTodo(title);
    setTitle("");
  }

  const completedCount = todosByStatus.completed.length;

  const SectionWrapper = isWideWeb ? XStack : YStack;
  const sections = ALL_STATUSES.map((status) => (
    <YStack
      key={status}
      flex={isWideWeb ? 1 : undefined}
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$4"
      padding="$3"
      gap="$2"
      minHeight={220}
    >
      <Paragraph>{STATUS_TITLES[status]}</Paragraph>
      {todosByStatus[status].length === 0 ? (
        <Paragraph>No items</Paragraph>
      ) : (
        todosByStatus[status].map((todo) => {
          const nextStatus = getNextStatus(todo.status);

          return (
            <YStack
              key={todo.id}
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              padding="$2"
              gap="$2"
            >
              <Paragraph>{todo.title}</Paragraph>
              <XStack gap="$2" flexWrap="wrap">
                <Button
                  size="$2"
                  onPress={() => updateTodoStatus(todo.id, nextStatus)}
                >
                  Move to {STATUS_TITLES[nextStatus]}
                </Button>
                <Button
                  size="$2"
                  theme="red"
                  onPress={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </XStack>
            </YStack>
          );
        })
      )}
    </YStack>
  ));

  return (
    <YStack flex={1} alignItems="stretch" padding="$6" gap="$4" width="100%">
      <H1>TODO List</H1>

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
          onPress={clearCompleted}
          disabled={completedCount === 0}
          opacity={completedCount === 0 ? 0.6 : 1}
        >
          Clear Completed
        </Button>
      </XStack>

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

      <Button size="$5" onPress={onGoBack}>
        Go Back
      </Button>
    </YStack>
  );
}
