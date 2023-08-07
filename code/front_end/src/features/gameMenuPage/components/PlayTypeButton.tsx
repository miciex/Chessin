import type { playType } from "../context/TypeContext";
import BaseButton from "../../../components/BaseButton";

type Props = {
  text: playType;
  handlePress: (gameType: playType) => void;
};

export default function PlayTypeButton({ text, handlePress }: Props) {
  return (
    <BaseButton
      text={text}
      handlePress={() => {
        handlePress(text);
      }}
    />
  );
}
