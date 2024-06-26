import { Move, getEmptyMove, moveFactory, copyMove } from "./move";
import { Pieces, Directions, baseRating } from "./ChessConstants";
import { FenToIntArray, boardToMap, mapToBoard } from "./helpMethods";
import { BoardResponse } from "../utils/ServicesTypes";

export type constructorArgs = {
  fenString?: string;
  whiteToMove?: boolean;
  availableCastles?: Array<number>;
  moves?: Array<Move>;
  board?: Board;
};

export type OnlineBoardConstructorArgs = constructorArgs & {
  gameType: GameType;
  whiteRating?: number;
  blackRating?: number;
  whiteRatingChange?: number;
  blackRatingChange?: number;
  isRated: boolean;
};

export const enum GameResults {
  THREE_FOLD = "THREE_FOLD",
  MATE = "MATE",
  DRAW_50_MOVE_RULE = "DRAW_50_MOVE_RULE",
  INSUFFICIENT_MATERIAL = "INSUFFICIENT_MATERIAL",
  STALEMATE = "STALEMATE",
  NONE = "NONE",
  BLACK_RESIGN = "BLACK_RESIGN",
  WHITE_RESIGN = "WHITE_RESIGN",
  WHITE_TIMEOUT = "WHITE_TIMEOUT",
  BLACK_TIMEOUT = "BLACK_TIMEOUT",
  DRAW_AGREEMENT = "DRAW_AGREEMENT",
  WHITE_DISCONNECTED="WHITE_DISCONNECTED",
  BLACK_DISCONNECTED="BLACK_DISCONNECTED",
  WHITE_ABANDONED="WHITE_ABANDONED",
  BLACK_ABANDONED="BLACK_ABANDONED",
  ABANDONED = "ABANDONED",
}

export const getWinner = (result:GameResults, whiteToMove: boolean) => {
  switch (result) {
    case GameResults.BLACK_RESIGN:
    case GameResults.BLACK_TIMEOUT:
      return "white";
    case GameResults.WHITE_RESIGN:
    case GameResults.WHITE_TIMEOUT:
      return "black";
    case GameResults.ABANDONED:
      return "abandoned";
    case GameResults.DRAW_AGREEMENT:
    case GameResults.INSUFFICIENT_MATERIAL:
    case GameResults.STALEMATE:
    case GameResults.THREE_FOLD:
    case GameResults.DRAW_50_MOVE_RULE:
      return "draw";
    case GameResults.MATE:
      return whiteToMove ? "black" : "white";
    default:
      return null;
  }
};

export enum GameType {
  CLASSICAL = "CLASSICAL",
  BLITZ = "BLITZ",
  BULLET = "BULLET",
  RAPID = "RAPID",
}

export type Board = {
  position: { [key: number]: number };
  whiteToMove: boolean;
  availableCastles: Array<number>;
  moves: Array<Move>;
  fen: string;
  visualBoard: Array<number>;
  positions: Array<{ [key: number]: number }>;
  movesTo50MoveRule: number;
  movedPieces: number[];
  result: GameResults;
};

export type OnlineBoardType = Board & {
  gameType: GameType;
  whiteRating: number;
  blackRating: number;
  whiteRatingChange: number;
  blackRatingChange: number;
  isRated: boolean;
};

export const BoardResponseToBoard = (boardResponse: BoardResponse): Board => {
  const moves = boardResponse.moves.map((move) => moveFactory(move));
  return {
    fen: boardResponse.startBoard,
    visualBoard: boardResponse.visualBoard,
    position: boardResponse.position,
    whiteToMove: boardResponse.whiteTurn,
    availableCastles: boardResponse.availableCastles,
    moves: moves,
    positions: boardResponse.positions,
    movesTo50MoveRule: boardResponse.movesTo50MoveRule,
    movedPieces: boardResponse.movedPieces,
    result: boardResponse.gameResult,
  };
};

export const BoardResponseToOnlineBoard = (
  boardResponse: BoardResponse
): OnlineBoardType => {
  const moves = boardResponse.moves.map((move) => moveFactory(move));

  return {
    fen: boardResponse.startBoard,
    visualBoard: boardResponse.visualBoard,
    position: boardResponse.position,
    whiteToMove: boardResponse.whiteTurn,
    availableCastles: boardResponse.availableCastles,
    moves: moves,
    positions: boardResponse.positions,
    movesTo50MoveRule: boardResponse.movesTo50MoveRule,
    movedPieces: boardResponse.movedPieces,
    result: boardResponse.gameResult,
    gameType: boardResponse.gameType,
    whiteRating: boardResponse.whiteRating,
    blackRating: boardResponse.blackRating,
    blackRatingChange: boardResponse.blackRatingChange,
    whiteRatingChange: boardResponse.whiteRatingChange,
    isRated: boardResponse.isRated,
  };
};

export const boardFactory = ({
  fenString,
  whiteToMove,
  availableCastles,
  moves,
  board,
}: constructorArgs): Board => {
  const visualBoard: Array<number> = fenString
    ? FenToIntArray(fenString, 64)
    : board
    ? board.visualBoard
    : new Array(64);
  const position: { [key: number]: number } = boardToMap(visualBoard);

  return {
    fen: fenString ? fenString : board ? board.fen : "",
    visualBoard: visualBoard,
    position: position,
    whiteToMove: whiteToMove ? whiteToMove : board ? board.whiteToMove : true,
    availableCastles: availableCastles
      ? availableCastles
      : board
      ? board.availableCastles
      : [0, 0, 0, 0],
    moves: moves ? moves : board ? board.moves : [],
    positions: board ? board.positions : [],
    movesTo50MoveRule: board ? board.movesTo50MoveRule : 0,
    movedPieces: resetMovedPieces(position),
    result: board ? board.result : GameResults.NONE,
  };
};

export const onlineBoardFactory = ({
  fenString,
  whiteToMove,
  availableCastles,
  moves,
  board,
  gameType,
  isRated,
  whiteRating,
  whiteRatingChange,
  blackRating,
  blackRatingChange,
}: OnlineBoardConstructorArgs): OnlineBoardType => {
  const brd = board
    ? board
    : boardFactory({ fenString, whiteToMove, availableCastles, moves, board });
  return {
    ...brd,
    gameType,
    isRated,
    whiteRating: whiteRating !== undefined ? whiteRating : baseRating,
    whiteRatingChange: whiteRatingChange ? whiteRatingChange : 0,
    blackRatingChange: blackRatingChange ? blackRatingChange : 0,
    blackRating: blackRating ? blackRating : baseRating,
  };
};

export const copyBoard = (board: Board): Board => {
  return {
    fen: board.fen,
    visualBoard: [...board.visualBoard],
    position: { ...board.position },
    whiteToMove: board.whiteToMove,
    availableCastles: [...board.availableCastles],
    moves: [...board.moves.map((move) => copyMove(move))],
    positions: [...board.positions.map((position) => ({ ...position }))],
    movesTo50MoveRule: board.movesTo50MoveRule,
    movedPieces: [...board.movedPieces],
    result: board.result,
  };
};

export const resetBoard = (fenString: string): Board => {
  const visualBoard: Array<number> = FenToIntArray(fenString, 64);
  const position: { [key: number]: number } = boardToMap(visualBoard);

  return {
    fen: fenString,
    visualBoard: visualBoard,
    position: position,
    whiteToMove: true,
    availableCastles: [0, 0, 0, 0],
    moves: new Array(),
    positions: new Array(),
    movesTo50MoveRule: 0,
    movedPieces: resetMovedPieces(position),
    result: GameResults.NONE,
  };
};

export const isWhite = (
  piecePosition: number,
  position: { [key: number]: number }
): boolean => {
  return position[piecePosition] < 16;
};

export const checkGameResult = (board: Board): GameResults => {
  let result: GameResults = GameResults.NONE;
  if (isThreefold(board)) result = GameResults.THREE_FOLD;
  else if (draw50MoveRule(board)) result = GameResults.DRAW_50_MOVE_RULE;
  else if (isStalemate(board)) {
    result = GameResults.STALEMATE;
  } else if (insufficientMaterial(board))
    result = GameResults.INSUFFICIENT_MATERIAL;
  else if (isMate(board)) result = GameResults.MATE;
  return result;
};

export const isDraw = (board: Board): boolean => {
  if (insufficientMaterial(board)) return true;
  if (isThreefold(board)) return true;
  if (draw50MoveRule(board)) return true;
  return false;
};

export const PossibleMoves = (
  piecePosition: number,
  board: Board
): Array<number> => {
  const piece = board.visualBoard[piecePosition] % 8;
  if (piece === Pieces.NONE) return new Array();
  switch (piece) {
    case Pieces.PAWN:
      const possibleMoves = PossiblePawnMoves(
        piecePosition,
        board.position,
        board.moves
      );
      return possibleMoves;
    case Pieces.KING:
      return allPossibleKingMoves(piecePosition, board);
    case Pieces.KNIGHT:
      return specialPossibleMoves(piecePosition, Pieces.KNIGHT, board.position);
  }
  let possibleMoves: Array<number> = new Array();
  if (Directions[piece]?.length && Directions[piece].length > 0)
    Directions[piece].forEach((i: number) => {
      let pos: number = piecePosition;
      while (IsCorrect(pos, i)) {
        pos += i;

        if (!(pos in board.position)) {
          possibleMoves.push(pos);
        } else if (
          board.position[pos] < 16 !=
          board.position[piecePosition] < 16
        ) {
          possibleMoves.push(pos);
          break;
        } else break;
      }
    });

  return possibleMoves;
};
export const possibleMovesAfterCheck = (
  piecePosition: number,
  board: Board
): Array<number> => {
  const possibleMoves = PossibleMoves(piecePosition, board);
  return deleteImpossibleMoves(possibleMoves, piecePosition, board);
};

export const addCastlingMoves = (
  piecePosition: number,
  board: Board
): Array<number> => {
  let moves: Array<number> = new Array();

  if (
    piecePosition === 4 &&
    board.availableCastles[0] === 0 &&
    0 in board.position &&
    board.position[0] % 8 === Pieces.ROOK &&
    isCastlingPossible(piecePosition, -1, board)
  )
    moves.push(2);
  if (
    piecePosition === 4 &&
    board.availableCastles[1] === 0 &&
    7 in board.position &&
    board.position[7] % 8 === Pieces.ROOK &&
    isCastlingPossible(piecePosition, 1, board)
  )
    moves.push(6);
  if (
    piecePosition === 60 &&
    board.availableCastles[2] === 0 &&
    56 in board.position &&
    board.position[56] % 8 === Pieces.ROOK &&
    isCastlingPossible(piecePosition, -1, board)
  )
    moves.push(58);
  if (
    piecePosition === 60 &&
    board.availableCastles[3] === 0 &&
    63 in board.position &&
    board.position[63] % 8 === Pieces.ROOK &&
    isCastlingPossible(piecePosition, 1, board)
  )
    moves.push(62);
  return moves;
};

export const isCastlingPossible = (
  piecePosition: number,
  dir: number,
  { position, whiteToMove }: Board
): boolean => {
  let row: number = Math.floor(Math.ceil((piecePosition + 1) / 8));
  let checkingRow: number = row,
    checkingPosition: number = piecePosition + dir;
  let checkingColumn: number = checkingPosition % 8;

  while (checkingRow === row) {
    if (
      (checkingColumn === 0 || checkingColumn === 7) &&
      checkingPosition in position
    ) {
      if (
        position[checkingPosition] % 8 != Pieces.ROOK ||
        isWhite(piecePosition, position) != whiteToMove
      )
        return false;
      else return true;
    }

    if (checkingPosition in position) return false;

    checkingPosition += dir;
    checkingColumn = checkingPosition % 8;
    checkingRow = Math.floor(Math.ceil((checkingPosition + 1) / 8));
  }

  return true;
};

export const deleteImpossibleMoves = (
  moves: Array<number>,
  activeField: number,
  board: Board
): Array<number> => {
  let possibleMoves: Array<number> = [];

  if (moves.length > 0)
    for (let i of moves) {
      let move: Move = moveFactory({
        pieces: board.position,
        startField: activeField,
        endField: i,
      });

      board = makeMove(move, board);

      if (isChecked(board) === -1) {
        if (
          board.position[i] % 8 === Pieces.KING &&
          Math.abs(i - activeField) === 2
        ) {
          if (
            isChecked(board, activeField) === -1 &&
            isChecked(board, activeField + (i - activeField) / 2) === -1 &&
            isChecked(board, i) === -1
          ) {
            //Possibly can be deleted
            // if (!(((activeField + (8 * multiplier)) in board.position) && isWhite(activeField + (8 * multiplier), board.position) == board.whiteToMove && board.position[activeField + (8 * multiplier)] % 8 === Pieces.PAWN)){
            possibleMoves.push(i);
            // }
          }
        } else possibleMoves.push(i);
      }
      board = unMakeMove(move, board);
    }
  return possibleMoves;
};

export const isChecked = (
  { position, whiteToMove }: Board,
  piecePosition?: number
): number => {
  let pos: number = piecePosition
    ? piecePosition
    : findKing(position, whiteToMove);
  let white: boolean = whiteToMove;
  for (let i of Pieces.PiecesArray) {
    if (isPieceAttackingTarget(i, pos, white, position)) return 1;
  }

  return -1;
};

export const isLongRangePieceAttackingTarget = (
  piece: number,
  targetSquare: number,
  isTargetWhite: boolean,
  position: { [key: number]: number }
): boolean => {
  let directions: Array<number> = getPieceDirections(piece);
  let checkingPosition: number;
  for (let i: number = 0; i < directions.length; i++) {
    checkingPosition = targetSquare;
    while (IsCorrect(checkingPosition, directions[i])) {
      checkingPosition += directions[i];
      if (!(checkingPosition in position)) continue;
      let foundPiece: number = position[checkingPosition];
      if (foundPiece < 16 === isTargetWhite) break;
      if (foundPiece % 8 === piece % 8 || foundPiece % 8 === Pieces.QUEEN)
        return true;
      break;
    }
  }
  return false;
};

export const isSpecialPieceAttackingTarget = (
  piece: number,
  targetSquare: number,
  isTargetWhite: boolean,
  position: { [key: number]: number }
): boolean => {
  let directions: Array<number> = getPieceDirections(piece);
  let checkingPosition: number;
  for (let i: number = 0; i < directions.length; i++) {
    checkingPosition = targetSquare + directions[i];
    if (!IsCorrect(targetSquare, directions[i])) continue;
    if (!(checkingPosition in position)) continue;
    let foundPiece: number = position[checkingPosition];
    if (foundPiece % 8 === piece && foundPiece < 16 !== isTargetWhite)
      return true;
  }
  return false;
};

export const isPawnAttackingTarget = (
  targetSquare: number,
  isTargetWhite: boolean,
  position: { [key: number]: number }
): boolean => {
  let directions: Array<number> = getPieceDirections(Pieces.PAWN);
  let checkingPosition: number,
    m: number = isTargetWhite ? -1 : 1;
  for (let i: number = 2; i < directions.length; i++) {
    checkingPosition = targetSquare + directions[i] * m;
    if (!IsCorrect(targetSquare, directions[i] * m)) continue;
    if (!(checkingPosition in position)) continue;
    let piece = position[checkingPosition];
    if (piece % 8 === Pieces.PAWN && piece < 16 != isTargetWhite) return true;
  }
  return false;
};

export const isPieceAttackingTarget = (
  piece: number,
  targetSquare: number,
  isTargetWhite: boolean,
  position: { [key: number]: number }
): boolean => {
  switch (piece % 8) {
    case Pieces.ROOK:
    case Pieces.BISHOP:
    case Pieces.QUEEN:
      return isLongRangePieceAttackingTarget(
        piece,
        targetSquare,
        isTargetWhite,
        position
      );
    case Pieces.KING:
    case Pieces.KNIGHT:
      return isSpecialPieceAttackingTarget(
        piece,
        targetSquare,
        isTargetWhite,
        position
      );
    case Pieces.PAWN:
      return isPawnAttackingTarget(targetSquare, isTargetWhite, position);
    default:
      return false;
  }
};

export const getPieceDirections = (piece: number): Array<number> => {
  return Directions[piece % 8];
};

export const PossiblePawnMoves = (
  piecePosition: number,
  position: { [key: number]: number },
  movesArr: Move[]
): Array<number> => {
  let moves: Array<number> = new Array();

  let white: boolean = isWhite(piecePosition, position);
  let mulptiplier: number = white ? -1 : 1;
  let directions: Array<number> = Directions[Pieces.PAWN];
  for (let i: number = 0; i < directions.length; i++) {
    if (!IsCorrect(piecePosition, mulptiplier * directions[i])) continue;
    let pos: number = mulptiplier * directions[i] + piecePosition;
    if (i < 2 && !(pos in position)) {
      if (i === 0) {
        moves.push(pos);
      } else if (
        Math.floor(3.5 - mulptiplier * 2.5) === Math.floor(piecePosition / 8) &&
        !(pos - 8 * mulptiplier in position)
      ) {
        moves.push(pos);
      }
    } else if (i > 1 && pos in position && position[pos] < 16 != white) {
      moves.push(pos);
    } else if (
      i > 1 &&
      getLastMove(movesArr).movedPiece % 8 === Pieces.PAWN &&
      Math.abs(
        getLastMove(movesArr).startField / 8 -
          getLastMove(movesArr).endField / 8
      ) === 2 &&
      pos === getLastMove(movesArr).endField + 8 * mulptiplier
    ) {
      moves.push(pos);
    }
  }

  return moves;
};

export const specialPossibleMoves = (
  piecePosition: number,
  piece: number,
  position: { [key: number]: number }
): Array<number> => {
  let moves: Array<number> = new Array();

  let white: boolean = isWhite(piecePosition, position);

  let checkingPosition: number;

  if (Directions[piece].length > 0)
    Directions[piece].forEach((i: number) => {
      checkingPosition = piecePosition + i;

      if (IsCorrect(piecePosition, i)) {
        if (
          !(
            checkingPosition in position &&
            isWhite(checkingPosition, position) === white
          )
        )
          moves.push(checkingPosition);
      }
    });
  return moves;
};

export const allPossibleKingMoves = (
  piecePosition: number,
  board: Board
): Array<number> => {
  let moves: Array<number> = specialPossibleMoves(
    piecePosition,
    Pieces.KING,
    board.position
  );
  let castlingMoves: Array<number> = addCastlingMoves(piecePosition, board);
  return [...moves, ...castlingMoves];
};

export const canMoveToSquare = (
  startPosition: number,
  piece: number,
  visualBoard: Array<number>,
  endPosition?: number
): Array<number> => {
  let moveList: Array<number> = new Array();
  if (piece % 8 === Pieces.KNIGHT)
    Directions[Pieces.KNIGHT].forEach((i: number) => {
      if (
        IsCorrect(endPosition ? endPosition : startPosition, i) &&
        visualBoard[i + (endPosition ? endPosition : startPosition)] ===
          piece &&
        (!endPosition || startPosition != i + endPosition)
      ) {
        moveList.push(endPosition ? endPosition : startPosition + i);
      }
    });
  else if (piece % 8 !== Pieces.KING) {
    let pos: number = endPosition ? endPosition : startPosition;
    Directions[piece % 8].forEach((i: number) => {
      pos += i;
      while (IsCorrect(pos - i, i)) {
        if (endPosition) {
          if (visualBoard[pos] === piece) {
            moveList.push(pos);
            break;
          }
          if (visualBoard[pos] != 0) break;
          pos += i;
        } else {
          pos += i;
          if (visualBoard[pos] === 0) continue;
          if (visualBoard[pos] === piece) {
            moveList.push(pos);
            break;
          }
          if (visualBoard[pos] != 0) break;
        }
      }
    });
  }
  return moveList;
};

export const IsCorrect = (position: number, checkingDir: number): boolean => {
  let checkingRow: number = position / 8 + Math.round(checkingDir / 8);
  let help: number =
    Math.abs(checkingDir % 8) > 4
      ? checkingDir > 0
        ? (checkingDir % 8) - 8
        : 8 + (checkingDir % 8)
      : checkingDir % 8;
  let checkingColumn: number = (position % 8) + help;

  return (
    checkingRow < 8 &&
    checkingRow >= 0 &&
    checkingColumn < 8 &&
    checkingColumn >= 0
  );
};

export const movePiece = (
  move: Move,
  position: { [key: number]: number }
): { [key: number]: number } => {
  let newPosition: { [key: number]: number } = { ...position };
  if (
    move.movedPiece % 8 === Pieces.KING &&
    Math.abs(move.startField - move.endField) === 2
  ) {
    newPosition[
      Math.floor(move.startField / 8) * 8 +
        (move.startField % 8) +
        Math.floor((move.endField - move.startField) / 2)
    ] =
      position[
        Math.floor(move.startField / 8) * 8 +
          Math.floor((move.endField % 8) / 4) * 7
      ];
    delete newPosition[
      Math.floor(move.startField / 8) * 8 +
        Math.floor((move.endField % 8) / 4) * 7
    ];
  } else if (
    move.movedPiece % 8 === Pieces.PAWN &&
    move.takenPiece % 8 === Pieces.PAWN &&
    move.endField != move.takenPieceField
  ) {
    //Removing the pawn which was taken end passant
    delete newPosition[move.takenPieceField];
  }
  newPosition[move.endField] =
    move.promotePiece === 0
      ? move.movedPiece
      : move.promotePiece + move.movedPiece - Pieces.PAWN;
  delete newPosition[move.startField];
  return newPosition;
};

export const unMovePiece = (
  move: Move,
  position: { [key: number]: number }
): { [key: number]: number } => {
  let newPosition: { [key: number]: number } = Object.assign({}, position);
  if (
    move.movedPiece % 8 === Pieces.KING &&
    Math.abs(move.startField - move.endField) === 2
  ) {
    newPosition[Math.floor(move.startField / 8) * 8 + Math.floor((move.endField % 8) / 4) * 7] =
      position[move.startField + Math.floor((move.endField - move.startField) / 2)];
    delete newPosition[move.startField + Math.floor((move.endField - move.startField) / 2)];
  }
  newPosition[move.startField] = move.movedPiece;
  delete newPosition[move.endField];
  if (move.takenPiece > 0) newPosition[move.takenPieceField] = move.takenPiece;
  return newPosition;
};

export const setCastles = (
  moves: Move[],
  availableCastles: number[]
): number[] => {
  const castles = [...availableCastles];
  if (moves.length === 0) return castles;
  let lastMove: Move = moves[moves.length - 1];
  if (lastMove.movedPiece % 8 === Pieces.KING) {
    for (
      let i = lastMove.movedPiece > 16 ? 0 : 2;
      i - (lastMove.movedPiece > 16 ? 0 : 2) < 2;
      i++
    ) {
      if (availableCastles[i] === 0) castles[i] = moves.length;
    }
    return castles;
  }

  if (lastMove.movedPiece === Pieces.ROOK) {
    for (let i = 0; i < availableCastles.length; i++) {
      if (
        availableCastles[i] === 0 &&
        lastMove.startField === 7 * (i % 2) + (i / 2) * 56
      ) {
        castles[i] = moves.length;
        return castles;
      }
    }
  }
  return castles;
};

export const unsetCastles = (
  moves: Move[],
  availableCastles: number[]
): Array<number> => {
  const castles = [...availableCastles];
  for (let i = 0; i < availableCastles.length; i++) {
    if (availableCastles[i] > moves.length) castles[i] = 0;
  }
  return castles;
};

export const makeMove = (move: Move, board: Board): Board => {
  board.position = movePiece(move, board.position);
  board.moves.push(move);
  board.availableCastles = setCastles(board.moves, board.availableCastles);
  board.positions.push({ ...board.position });
  if (board.movedPieces[move.startField] === 0) {
    board.movedPieces[move.startField] = board.moves.length;
  }
  return board;
};

export const unMakeMove = (move: Move, board: Board): Board => {
  board.position = unMovePiece(move, board.position);
  board.availableCastles = unsetCastles(board.moves, board.availableCastles);
  board.moves = removeLastMove(board.moves);
  board.positions.pop();
  if (
    board.movedPieces[move.startField] > 0 &&
    board.movedPieces[move.startField] < board.moves.length
  ) {
    board.movedPieces[move.startField] = 0;
  }
  return board;
};

export const playMove = (move: Move, board: Board): Board => {
  board = makeMove(move, board);
  board.visualBoard = mapToBoard(board.position);
  
  board.movesTo50MoveRule = draw50MoveRuleCheck(board);
  board.result = checkGameResult(board);
  board.whiteToMove = !board.whiteToMove;
  console.log(board.visualBoard);
  return board;
};

export const unPlayMove = (move: Move, board: Board): Board => {
  board = unMakeMove(move, board);
  board.visualBoard = mapToBoard(board.position);
  board.movesTo50MoveRule =
    board.movesTo50MoveRule > 0 ? board.movesTo50MoveRule - 1 : 0;
  board.result = GameResults.NONE;
  board.whiteToMove = !board.whiteToMove;
  return board;
};

export const isEndgame = (position: { [key: number]: number }): boolean => {
  if (
    !(Pieces.QUEEN + Pieces.WHITE in position) &&
    !(Pieces.QUEEN + Pieces.BLACK in position)
  )
    return true;

  if (Pieces.QUEEN + Pieces.WHITE in position) {
    let minorPieces: boolean = false;

    if (Object.entries(position).length > 0)
      Object.entries(position).forEach(([_, value]) => {
        if (value < 16) {
          if (value % 8 === Pieces.ROOK) return false;
          if (value % 8 === Pieces.KNIGHT || value % 8 === Pieces.BISHOP) {
            if (minorPieces === true) return false;
            minorPieces = true;
          }
        }
      });
  }

  if (Pieces.QUEEN + Pieces.BLACK in position) {
    let minorPieces: boolean = false;

    if (Object.entries(position).length > 0)
      Object.entries(position).forEach(([_, value]) => {
        if (value >= 16) {
          if (value % 8 === Pieces.ROOK) return false;
          if (value % 8 === Pieces.KNIGHT || value % 8 === Pieces.BISHOP) {
            if (minorPieces === true) return false;
            minorPieces = true;
          }
        }
      });
  }

  return true;
};

export const resetMovedPieces = (position: {
  [key: number]: number;
}): number[] => {
  let pieces: number[] = new Array(64);
  for (let i = 0; i < pieces.length; i++) {
    if (i in position) pieces[i] = 0;
    else pieces[i] = -1;
  }
  return pieces;
};

export const getLastMove = (moves: Move[]): Move => {
  return moves.length > 0 ? moves[moves.length - 1] : getEmptyMove();
};

export const removeLastMove = (moves: Move[]): Move[] => {
  const newMoves: Move[] = [...moves];
  newMoves.pop();
  return newMoves;
};

export const getPositionCopy = (position: {
  [key: number]: number;
}): { [key: number]: number } => {
  return { ...position };
};

export const findKing = (
  position: { [key: number]: number },
  whiteToMove: boolean
): number => {
  let piecePosition: number = -1;

  for (const [key, _] of Object.entries(position)) {
    if (
      key in position &&
      position[Number(key)] % 8 === Pieces.KING &&
      isWhite(Number(key), position) === whiteToMove
    )
      return Number(key);
  }

  return piecePosition;
};

export const isMate = (board: Board): boolean => {
  for (const [key, value] of Object.entries(getPositionCopy(board.position))) {
    if (value < 16 === board.whiteToMove) {
      let squares: Array<number> = PossibleMoves(Number(key), board);
      squares = deleteImpossibleMoves(squares, Number(key), board);
      if (squares.length > 0) return false;
    }
  }
  if (isChecked(board) === -1) return false;
  return true;
};

export const isStalemate = (board: Board): boolean => {
  for (let [key, value] of Object.entries(getPositionCopy(board.position))) {
    if (
      (value > 16 && !board.whiteToMove) ||
      (value < 16 && board.whiteToMove)
    ) {
      const squares: Array<number> = PossibleMoves(Number(key), board);
      const possibleMoves = deleteImpossibleMoves(squares, Number(key), board);
      if (possibleMoves.length > 0) {
        return false;
      }
    }
  }
  if (isChecked(board) != -1) return false;
  return true;
};

export const isThreefold = (board: Board): boolean => {
  if (board.positions?.length && board.positions.length < 5) return false;
  let currentPos: { [key: number]: number } = board.position;

  let repetitions: number = 0;

  f: for (const position of board.positions) {
    for (const [key, value] of Object.entries(position)) {
      if (!(key in currentPos) || currentPos[Number(key)] != value) continue f;
    }
    repetitions++;
    if (repetitions === 3) {
      return true;
    }
  }
  return false;
};

export const draw50MoveRuleCheck = (board: Board) => {
  const lastMove: Move = getLastMove(board.moves);
  if (lastMove.movedPiece === Pieces.PAWN || lastMove.takenPiece != 0) return 0;
  return board.movesTo50MoveRule++;
};

export const draw50MoveRule = (board: Board): boolean => {
  if (board.movesTo50MoveRule === 100) return true;
  return false;
};

export const insufficientMaterial = (position: {
  [key: number]: number;
}): boolean => {
  if (Object.keys(position).length > 4) return false;
  if (Object.keys(position).length === 2) return true;
  if (
    (Pieces.PAWN | Pieces.WHITE) in position ||
    (Pieces.PAWN | Pieces.BLACK) in position
  )
    return false;
  let blackKnights: number = 0;
  let whiteKnights: number = 0;
  let blackBishops: Array<number> = new Array();
  let whiteBishops: Array<number> = new Array();
  for (let [key, value] of Object.entries(position)) {
    switch (value) {
      case Pieces.KNIGHT | Pieces.WHITE:
        whiteKnights++;
        break;
      case Pieces.KNIGHT | Pieces.BLACK:
        blackKnights++;
        break;
      case Pieces.BISHOP | Pieces.WHITE:
        whiteBishops.push(Number(key));
        break;
      case Pieces.BISHOP | Pieces.BLACK:
        blackBishops.push(Number(key));
        break;
      default:
        return false;
    }
  }

  if (
    Object.keys(position).length === 3 ||
    whiteKnights === 2 ||
    blackKnights === 2
  )
    return false;

  if (
    whiteBishops.length === blackBishops.length ||
    blackKnights === whiteKnights
  )
    return true;
  if (
    blackBishops.length === 2 &&
    (blackBishops[0] % 2 === (blackBishops[0] / 8) % 2) ===
      (blackBishops[1] % 2 === (blackBishops[1] / 8) % 2)
  )
    return true;
  if (
    whiteBishops.length === 2 &&
    (whiteBishops[0] % 2 === (whiteBishops[0] / 8) % 2) ===
      (whiteBishops[1] % 2 === (whiteBishops[1] / 8) % 2)
  )
    return true;
  return false;
};
