import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@repo/app";
import { UILibraryScreen } from "@repo/app";

type Props = NativeStackScreenProps<RootStackParamList, "UILibrary">;

export function UILibraryRoute({ navigation }: Props) {
  return <UILibraryScreen onGoBack={() => navigation.goBack()} />;
}
