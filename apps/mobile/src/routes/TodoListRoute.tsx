import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@repo/app";
import { TodoListScreen } from "@repo/app";

type Props = NativeStackScreenProps<RootStackParamList, "TodoList">;

export function TodoListRoute({ navigation, route }: Props) {
  return <TodoListScreen onGoBack={() => navigation.goBack()} />;
}
