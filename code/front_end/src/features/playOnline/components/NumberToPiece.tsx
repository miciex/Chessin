import { FontAwesome5 } from "@expo/vector-icons";

type Props = {
  piece: number;
  pieceSize: number;
};

export const NumberToPiece = ({ piece, pieceSize }: Props) => {
  switch (piece) {
    case 17:
      return <FontAwesome5 name="chess-king" size={pieceSize} color="black" />;
    case 22:
      return <FontAwesome5 name="chess-queen" size={pieceSize} color="black" />;
    case 19:
      return <FontAwesome5 name="chess-rook" size={pieceSize} color="black" />;
    case 21:
      return (
        <FontAwesome5 name="chess-bishop" size={pieceSize} color="black" />
      );
    case 20:
      return (
        <FontAwesome5 name="chess-knight" size={pieceSize} color="black" />
      );
    case 18:
      return <FontAwesome5 name="chess-pawn" size={pieceSize} color="black" />;
    case 9:
      return <FontAwesome5 name="chess-king" size={pieceSize} color="white" />;
    case 14:
      return <FontAwesome5 name="chess-queen" size={pieceSize} color="white" />;
    case 11:
      return <FontAwesome5 name="chess-rook" size={pieceSize} color="white" />;
    case 13:
      return (
        <FontAwesome5 name="chess-bishop" size={pieceSize} color="white" />
      );
    case 12:
      return (
        <FontAwesome5 name="chess-knight" size={pieceSize} color="white" />
      );
    case 10:
      return <FontAwesome5 name="chess-pawn" size={pieceSize} color="white" />;
    default:
      return null;
  }
};
