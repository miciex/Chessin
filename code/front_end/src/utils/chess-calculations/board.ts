import { HashMap } from "../Types";
import { Move } from "./move";
import { GameResults } from "./ChessTypes";
import { Pieces, Directions } from "../ChessConstants";


class Board {

    position: HashMap<number> = {};
    whiteToMove: boolean = true;
    availableCastles: Array<number> = [];
    moves: Array<Move> = [];
    fen: string = "";
    visualBoard: Array<number> = [];
    positions: Array<HashMap<number>> = [];
    movesTo50MoveRule: number = 0;
    movedPieces: number[] = new Array(64).fill(0);

    Board(fenString:string, whiteToMove:boolean, availableCastles:Array<number>, moves:Array<Move>){
        this.fen = fenString;
        this.visualBoard = FenToIntArray(this.fen, 64);
        this.position = boardToMap(this.visualBoard);
        this.whiteToMove = whiteToMove;
        this.availableCastles = availableCastles;
        this.moves = moves;
        this.positions = new Array();
        this.movesTo50MoveRule = 0;
        this.resetMovedPieces();
    }

     Board(fenString:string){
        this.fen = fenString;
        this.visualBoard = FenToIntArray(this.fen, 64);
        this.position = boardToMap(this.visualBoard);
        this.whiteToMove = true;
        this.availableCastles = new int[]{0,0,0,0};
        this.moves = new Array();
        this.positions = new Array();
        this.movesTo50MoveRule = 0;
        this.resetMovedPieces();
    }

     Board(board:Board){
        this.fen = board.fen;
        this.visualBoard = board.visualBoard;
        this.position =  {...board.position};
        this.whiteToMove = board.whiteToMove;
        this.availableCastles = [...board.availableCastles];
        this.moves = board.moves;
        this.positions = board.positions;
        this.movesTo50MoveRule = 0;
        this.resetMovedPieces();
    }

    resetBoard(){
        this.visualBoard = FenToIntArray(this.fen, 64);
        this.position = boardToMap(this.visualBoard);
        this.whiteToMove = true;
        this.availableCastles = [0,0,0,0];
        this.moves = new Array();
        this.positions = new Array();
        this.movesTo50MoveRule = 0;
        this.resetMovedPieces();
    }

    isWhite(piecePosition:number):boolean{
        return this.position.piecePosition < 16 ? true : false;
    }

    checkGameResult():GameResults {
        let result: GameResults = GameResults.NONE;

        //Do the same in engine
        //movesTo50MoveRule = CheckGameResults.draw50MoveRuleCheck(move, movesTo50MoveRule);

        if (CheckGameResults.isThreefold(this))
            result = GameResults.THREE_FOLD;
        if (CheckGameResults.draw50MoveRule(movesTo50MoveRule))
            result = GameResults.DRAW_50_MOVE_RULE;
        else if (CheckGameResults.isStalemate(this))
            result = GameResults.STALEMATE;
        else if (CheckGameResults.insufficientMaterial(this))
            result = GameResults.INSUFFICIENT_MATERIAL;
        else if (CheckGameResults.isMate(this))
            result = GameResults.MATE;
        return result;
    }

    isDraw():boolean{
        if (CheckGameResults.insufficientMaterial(this))
            return true;
        if (CheckGameResults.isThreefold(this))
            return true;
        if (CheckGameResults.draw50MoveRule(this.movesTo50MoveRule))
            return true;
        return false;
    }

    PossibleMoves(position:number):Array<number> {
        switch (this.position.position % 8) {
            case Pieces.PAWN: 
                return PossiblePawnMoves(position);
            case Pieces.KING:
                return allPossibleKingMoves(position);
            case Pieces.KNIGHT:
                return specialPossibleMoves(position, Pieces.KNIGHT);
        }

        let moves:Array<number> = new Array();
        Directions[position % 8].forEach((i:number) => {
            let pos:number = position;
            while (IsCorrect(pos, i)) {
                pos += i;
                 
                if (!(pos in this.position)) {
                    moves.push(pos);
                } else if (this.position.pos < 16 != this.position.position < 16) {
                    moves.push(pos);
                    break;
                } else
                    break;
            }
        })

        return moves;
    }

    addCastlingMoves(position:number):Array<number> {
        let moves:Array<number> = new Array();

        if (position == 4 && this.availableCastles[0] == 0 &&  (0 in this.position) && this.position[0] % 8 == Pieces.ROOK && isCastlingPossible(position, -1))
            moves.push(2);
        if (position == 4 && this.availableCastles[1] == 0 && (7 in this.position) && this.position[7] % 8 == Pieces.ROOK && isCastlingPossible(position, 1))
            moves.push(6);
        if (position == 60 && this.availableCastles[2] == 0 && (56 in this.position) && this.position[56] % 8 == Pieces.ROOK && isCastlingPossible(position, -1))
            moves.push(58);
        if (position == 60 && this.availableCastles[3] == 0 && (63 in this.position) && this.position[63] % 8 == Pieces.ROOK && isCastlingPossible(position, 1))
            moves.push(62);

        return moves;
    }

    isCastlingPossible(position:number, dir:number): boolean {
        let row:number = Math.floor(Math.ceil((position + 1) / 8));
        let checkingRow:number = row, checkingPosition:number = position + dir;
        let checkingColumn:number = (checkingPosition) % 8;

        while (checkingRow == row) {
            if ((checkingColumn == 0 || checkingColumn == 7) && checkingPosition in this.position) {
                if (this.position.checkingPosition % 8 != Pieces.ROOK
                        || isWhite(checkingPosition) != this.whiteToMove)
                    return false;
                else
                    return true;
            }

            if (checkingPosition in this.position)
                return false;

            checkingPosition += dir;
            checkingColumn = checkingPosition % 8;
            checkingRow = Math.floor(Math.ceil((checkingPosition + 1) / 8));
        }

        return true;
    }

    deleteImpossibleMoves(moves:Array<number>, activeField:number):Array<number> {
        let possibleMoves:Array<number> = new Array();
        
        let multiplier:number = this.whiteToMove ? -1 : 1;

        moves.forEach((i:number) => {
            let move:Move = new Move({pieces: this.position,startField: activeField,endField: i});
            let copy:{[key:number]:number} = this.position;
            this.makeMove(move);

            if (this.isChecked() == -1) {
                if (copy[activeField] % 8 == Pieces.KING && Math.abs(i - activeField) == 2) {
                    if (this.isChecked(activeField) == -1 && this.isChecked(activeField + (i - activeField) / 2) == -1 && this.isChecked(i) == -1)
                        if (!(((activeField + (8 * multiplier)) in this.position) && this.isWhite(activeField + (8 * multiplier)) != this.whiteToMove && this.position[activeField + (8 * multiplier)] % 8 == Pieces.PAWN))
                            possibleMoves.push(i);
                } else
                    possibleMoves.push(i);
            }
            this.unMakeMove(move);
        })

        return possibleMoves;
    }

    public  isChecked():number {
        let position:number = HelpMethods.findKing(this);
        let king:number = this.position[position];

        Pieces.PiecesArray.forEach((i:number) =>{
            if(this.isPieceAttackingTarget(i, position, king < 16))
                return 1;
        })

        return -1;
    }

    public  isChecked(position:number):number {
        Pieces.PiecesArray.forEach((i:number) =>{
            if(this.isPieceAttackingTarget(i, position, this.whiteToMove))
                return 1;
        })

        return -1;
    }

    private isLongRangePieceAttackingTarget(piece:number, targetSquare:number, isTargetWhite:boolean):boolean{
        let directions:Array<number> = this.getPieceDirections(piece);
        let checkingPosition:number;
        for(let i:number = 0; i<directions.length; i++){
            checkingPosition = targetSquare;
            while(this.IsCorrect(checkingPosition, directions[i])){
                checkingPosition += directions[i];
                if(!(checkingPosition in this.position)) continue;
                let foundPiece:number = this.position[checkingPosition];
                if(foundPiece < 16 == isTargetWhite) break;
                if(foundPiece%8 == piece%8 || foundPiece%8 == Pieces.QUEEN)
                    return true;
                else break;
            }
        }
        return false;
    }

    private isSpecialPieceAttackingTarget(piece:number,  targetSquare:number, isTargetWhite:boolean):boolean{
        let directions:Array<number> = this.getPieceDirections(piece);
        let checkingPosition:number;
        for(let i:number = 0; i<directions.length; i++){
            checkingPosition = targetSquare + directions[i];
            if(!this.IsCorrect(targetSquare, directions[i])) continue;
            if(!(checkingPosition in this.position)) continue;
            let foundPiece:number = this.position[checkingPosition];
            if(foundPiece%8 == piece && foundPiece < 16 != isTargetWhite)
                return true;
        }
        return false;
    }

    private isPawnAttackingTarget(targetSquare:number, isTargetWhite:boolean):boolean{
        let directions:Array<number> = this.getPieceDirections(Pieces.PAWN);
        let checkingPosition:number, m:number = isTargetWhite ? -1 : 1;
        for(let i:number = 2; i<directions.length; i++){
            checkingPosition = targetSquare + directions[i] * m;
            if(!this.IsCorrect(targetSquare, directions[i] * m)) continue;
            if(!(checkingPosition in this.position)) continue;
            let piece = this.position.checkingPosition;
            if(piece%8 == Pieces.PAWN && piece < 16 != isTargetWhite)
                return true;
        }
        return false;
    }

    private isPieceAttackingTarget(piece:number, targetSquare:number, isTargetWhite:boolean):boolean{
        switch (piece%8){
            case Pieces.ROOK: 
            case Pieces.BISHOP:
            case Pieces.QUEEN:
                return this.isLongRangePieceAttackingTarget(piece, targetSquare, isTargetWhite);
            case Pieces.KING:
            case Pieces.KNIGHT:
                return this.isSpecialPieceAttackingTarget(piece, targetSquare, isTargetWhite);
            case Pieces.PAWN:
                return this.isPawnAttackingTarget(targetSquare, isTargetWhite);
            default: return false;
        }
    }

    private  getPieceDirections(piece:number):Array<number>{
        return Directions[piece%8];
    }

    private  PossiblePawnMoves(position:number):Array<number> {
        let moves:Array<number> = new Array();

        let isWhite:boolean = this.isWhite(position);
        let mulptiplier:number = isWhite ? -1 : 1;
        let directions:Array<number> = Directions[Pieces.PAWN];
        for (let i:number = 0; i < directions.length; i++) {
            if (!this.IsCorrect(position, mulptiplier * directions[i])) continue;
            let pos:number = mulptiplier * directions[i] + position;
            if (i < 2 && !(pos in this.position)) {
                if (i == 0)
                    moves.push(pos);
                else if (Math.floor( (3.5 - mulptiplier * 2.5)) == position / 8 && !(pos - 8 * mulptiplier in this.position)) {
                    moves.push(pos);
                }
            } else if (i > 1 && (pos in this.position) && (this.position[pos] < 16 != isWhite)) {
                moves.push(pos);
            } else if (i > 1 && this.getLastMove().movedPiece % 8 == Pieces.PAWN && Math.abs((this.getLastMove().startField / 8) - (this.getLastMove().endField / 8)) == 2 && pos == this.getLastMove().endField + 8 * mulptiplier) {
                moves.push(pos);
            }
        }

        return moves;
    }

    private specialPossibleMoves(position:number, piece:number):Array<number> {
        let moves:Array<number> = new Array();

        let isWhite:boolean = this.isWhite(position);

        let checkingPosition:number;

        Directions[piece].forEach((i:number) => {
            checkingPosition = position + i;

            if (this.IsCorrect(position, i)) {
                if ((checkingPosition in this.position) && this.isWhite(checkingPosition) === isWhite)
                    continue;

                moves.push(checkingPosition);
            }
        })
        return moves;
    }

    
    private allPossibleKingMoves(position:number):Array<number> {
        let moves:Array<number> = this.specialPossibleMoves(position, Pieces.KING);
        moves.push.apply([...this.addCastlingMoves(position)]);
        return moves;
    }
    public canMoveToSquare(startPosition:number, piece:number):Array<number>;
    public canMoveToSquare(startPosition:number, piece:number, endPosition?:number):Array<number> {
        
        let moveList:Array<number> = new Array();
        if (piece % 8 === Pieces.KNIGHT)
            Directions[Pieces.KNIGHT].forEach((i:number) => {
                if (this.IsCorrect(endPosition?endPosition:startPosition, i) && this.visualBoard[i + (endPosition?endPosition:startPosition)] == piece && (!endPosition || startPosition != i + (endPosition))) {
                    moveList.push(endPosition?endPosition:startPosition + i);
                }
            });
        else if (piece % 8 !== Pieces.KING) {
            let pos:number = endPosition?endPosition:startPosition
            Directions[piece%8].forEach((i:number) => {
                pos += i;
                while (this.IsCorrect(pos - i, i)) {
                    if(endPosition){
                    if (this.visualBoard[pos] == piece) {
                        moveList.push(pos);
                        break;
                    }
                    if (this.visualBoard[pos] != 0)
                        break;
                    pos += i;
                    }else{
                        pos += i;
                        if (this.visualBoard[pos] == 0)
                            continue;
                        if (this.visualBoard[pos] == piece) {
                            moveList.push(pos);
                            break;
                        }
                        if (this.visualBoard[pos] != 0)
                            break;
                    }

                }
            })
        }
        return moveList;
    }

    private IsCorrect(position:number, checkingDir:number):boolean {
        let checkingRow:number = ((position) / 8) +  Math.round(checkingDir / 8);
        let help:number = Math.abs(checkingDir % 8) > 4 ? (checkingDir > 0 ? checkingDir % 8 - 8 : 8 + checkingDir % 8)
                : checkingDir % 8;
        let checkingColumn:number = position % 8 + help;

        return checkingRow < 8 && checkingRow >= 0 && checkingColumn < 8 && checkingColumn >= 0;
    }

    public movePiece(move:Move):void {
        if (move.movedPiece % 8 == King && Math.abs(move.startField - move.endField) == 2) {
            //Changing rooks placement in castling
            position.put((move.startField / 8) * 8 + move.startField % 8 + (move.endField - move.startField) / 2, position.get((move.startField / 8) * 8 + ((move.endField % 8) / 4) * 7));
            position.remove((move.startField / 8) * 8 + ((move.endField % 8) / 4) * 7);
        } else if (move.movedPiece % 8 == Pawn && move.takenPiece % 8 == Pawn && move.endField != move.takenPieceField) {
            //Removing the pawn which was taken end passant
            position.remove(move.takenPieceField);
        }
        position.put(move.endField, move.promotePiece == 0 ? move.movedPiece : move.promotePiece + move.movedPiece - Pawn);
        position.remove(move.startField);
    }
}