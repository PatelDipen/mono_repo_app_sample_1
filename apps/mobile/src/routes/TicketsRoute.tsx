import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@repo/app";
import { TicketsScreen } from "@repo/app";

type Props = NativeStackScreenProps<RootStackParamList, "Tickets">;

export function TicketsRoute({ navigation }: Props) {
  return <TicketsScreen onGoBack={() => navigation.goBack()} />;
}
