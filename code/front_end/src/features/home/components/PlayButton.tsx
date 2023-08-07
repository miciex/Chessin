import { RootStackParamList } from "../../../../Routing";
import BaseButton from "../../../components/BaseButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "Home" | "GameMenu",
    undefined
  >;
};

export default function PlayButton({ navigation }: Props) {
  const handlePress = () => {
    navigation.navigate("GameMenu");
  };

  return <BaseButton handlePress={handlePress} text="Play" />;
}
