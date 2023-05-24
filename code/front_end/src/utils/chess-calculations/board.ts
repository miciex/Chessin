import { HashMap } from "../Types";
import { Move } from "./move";
import { GameResults } from "./ChessTypes";
import { Pieces, Directions } from "./ChessConstants";
import { FenToIntArray, boardToMap } from "./helpMethods";

export type constructorArgs = {
    fenString?:string;
    whiteToMove?:boolean; 
    availableCastles?:Array<number>;
    moves?:Array<Move>;
    board?:Board;
}

export default class Board {

    position: {[key:number]:number} = {};
    whiteToMove: boolean = true;
    availableCastles: Array<number> = [];
    moves: Array<Move> = [];
    fen: string = "";
    visualBoard: Array<number> = [];
    positions: Array<HashMap<number>> = [];
    movesTo50MoveRule: number = 0;
    movedPieces: number[] = new Array(64).fill(0);
    result: GameResults = GameResults.NONE;

    constructor({fenString, whiteToMove, availableCastles, moves, board}:constructorArgs){
        this.fen = fenString?fenString:(board?board.fen:"");
        this.visualBoard = FenToIntArray(this.fen, 64);
        this.position = boardToMap(this.visualBoard);
        this.whiteToMove = whiteToMove?whiteToMove:(board?board.whiteToMove:true);
        this.availableCastles = availableCastles?availableCastles:(board?board.availableCastles:[0,0,0,0]);
        this.moves = moves?moves:(board?board.moves:[]);
        this.positions = board?board.positions:new Array();
        this.movesTo50MoveRule = board?board.movesTo50MoveRule: 0;
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
        return this.position[piecePosition] < 16 ? true : false;
    }

    checkGameResult():GameResults {
        let result: GameResults = GameResults.NONE;

        //Do the same in engine
        //movesTo50MoveRule = CheckGameResults.draw50MoveRuleCheck(move, movesTo50MoveRule);

        if (this.isThreefold())
            result = GameResults.THREE_FOLD;
        if (this.draw50MoveRule())
            result = GameResults.DRAW_50_MOVE_RULE;
        else if (this.isStalemate())
            result = GameResults.STALEMATE;
        else if (this.insufficientMaterial())
            result = GameResults.INSUFFICIENT_MATERIAL;
        else if (this.isMate())
            result = GameResults.MATE;
        return result;
    }

    isDraw():boolean{
        if (this.insufficientMaterial())
            return true;
        if (this.isThreefold())
            return true;
        if (this.draw50MoveRule())
            return true;
        return false;
    }

    PossibleMoves(position:number):Array<number> {
        switch (this.position[position] % 8) {
            case Pieces.PAWN: 
                return this.PossiblePawnMoves(position);
            case Pieces.KING:
                return this.allPossibleKingMoves(position);
            case Pieces.KNIGHT:
                return this.specialPossibleMoves(position, Pieces.KNIGHT);
        }

        let moves:Array<number> = new Array();
        Directions[position % 8].forEach((i:number) => {
            let pos:number = position;
            while (this.IsCorrect(pos, i)) {
                pos += i;
                 
                if (!(pos in this.position)) {
                    moves.push(pos);
                } else if (this.position[pos] < 16 != this.position[position] < 16) {
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

        if (position === 4 && this.availableCastles[0] === 0 &&  (0 in this.position) && this.position[0] % 8 === Pieces.ROOK && this.isCastlingPossible(position, -1))
            moves.push(2);
        if (position === 4 && this.availableCastles[1] === 0 && (7 in this.position) && this.position[7] % 8 === Pieces.ROOK && this.isCastlingPossible(position, 1))
            moves.push(6);
        if (position === 60 && this.availableCastles[2] === 0 && (56 in this.position) && this.position[56] % 8 === Pieces.ROOK && this.isCastlingPossible(position, -1))
            moves.push(58);
        if (position === 60 && this.availableCastles[3] === 0 && (63 in this.position) && this.position[63] % 8 === Pieces.ROOK && this.isCastlingPossible(position, 1))
            moves.push(62);

        return moves;
    }

    isCastlingPossible(position:number, dir:number): boolean {
        let row:number = Math.floor(Math.ceil((position + 1) / 8));
        let checkingRow:number = row, checkingPosition:number = position + dir;
        let checkingColumn:number = (checkingPosition) % 8;

        while (checkingRow === row) {
            if ((checkingColumn === 0 || checkingColumn === 7) && checkingPosition in this.position) {
                if (this.position[checkingPosition] % 8 != Pieces.ROOK
                        || this.isWhite(checkingPosition) != this.whiteToMove)
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

            if (this.isChecked() === -1) {
                if (copy[activeField] % 8 === Pieces.KING && Math.abs(i - activeField) === 2) {
                    if (this.isChecked(activeField) === -1 && this.isChecked(activeField + (i - activeField) / 2) === -1 && this.isChecked(i) === -1)
                        if (!(((activeField + (8 * multiplier)) in this.position) && this.isWhite(activeField + (8 * multiplier)) != this.whiteToMove && this.position[activeField + (8 * multiplier)] % 8 === Pieces.PAWN))
                            possibleMoves.push(i);
                } else
                    possibleMoves.push(i);
            }
            this.unMakeMove(move);
        })

        return possibleMoves;
    }

    public  isChecked(position?:number):number {
        let pos:number = position?position:this.findKing();
        let isWhite = position?this.isWhite(pos):this.position[pos]<16;
        Pieces.PiecesArray.forEach((i:number) =>{
            if(this.isPieceAttackingTarget(i, pos, isWhite))
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
                if(foundPiece < 16 === isTargetWhite) break;
                if(foundPiece%8 === piece%8 || foundPiece%8 === Pieces.QUEEN)
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
            if(foundPiece%8 === piece && foundPiece < 16 != isTargetWhite)
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
            let piece = this.position[checkingPosition];
            if(piece%8 === Pieces.PAWN && piece < 16 != isTargetWhite)
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
                if (i === 0)
                    moves.push(pos);
                else if (Math.floor( (3.5 - mulptiplier * 2.5)) === position / 8 && !(pos - 8 * mulptiplier in this.position)) {
                    moves.push(pos);
                }
            } else if (i > 1 && (pos in this.position) && (this.position[pos] < 16 != isWhite)) {
                moves.push(pos);
            } else if (i > 1 && this.getLastMove().movedPiece % 8 === Pieces.PAWN && Math.abs((this.getLastMove().startField / 8) - (this.getLastMove().endField / 8)) === 2 && pos === this.getLastMove().endField + 8 * mulptiplier) {
                moves.push(pos);
            }
        }

        return moves;
    }

    private specialPossibleMoves(position:number, piece:number):Array<number> {
        let moves:Array<number> = new Array();

        let isWhite:boolean = this.isWhite(position);

        let checkingPosition:number;

        f:Directions[piece].forEach((i:number) => {
            checkingPosition = position + i;

            if (this.IsCorrect(position, i)) {
                if (!((checkingPosition in this.position) && this.isWhite(checkingPosition) === isWhite))
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
                if (this.IsCorrect(endPosition?endPosition:startPosition, i) && this.visualBoard[i + (endPosition?endPosition:startPosition)] === piece && (!endPosition || startPosition != i + (endPosition))) {
                    moveList.push(endPosition?endPosition:startPosition + i);
                }
            });
        else if (piece % 8 !== Pieces.KING) {
            let pos:number = endPosition?endPosition:startPosition
            Directions[piece%8].forEach((i:number) => {
                pos += i;
                while (this.IsCorrect(pos - i, i)) {
                    if(endPosition){
                    if (this.visualBoard[pos] === piece) {
                        moveList.push(pos);
                        break;
                    }
                    if (this.visualBoard[pos] != 0)
                        break;
                    pos += i;
                    }else{
                        pos += i;
                        if (this.visualBoard[pos] === 0)
                            continue;
                        if (this.visualBoard[pos] === piece) {
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
        if (move.movedPiece % 8 === Pieces.KING && Math.abs(move.startField - move.endField) === 2) {
            //Changing rooks placement in castling
            this.position[(move.startField / 8) * 8 + move.startField % 8 + (move.endField - move.startField) / 2] = this.position[((move.startField / 8) * 8 + ((move.endField % 8) / 4) * 7)];
            delete this.position[((move.startField / 8) * 8 + ((move.endField % 8) / 4) * 7)];
        } else if (move.movedPiece % 8 === Pieces.PAWN && move.takenPiece % 8 === Pieces.PAWN && move.endField != move.takenPieceField) {
            //Removing the pawn which was taken end passant
            delete this.position[move.takenPieceField];
        }
        this.position[move.endField] = move.promotePiece === 0 ? move.movedPiece : move.promotePiece + move.movedPiece - Pieces.PAWN;
        delete this.position[move.startField];
    }

    public unMovePiece(move:Move):void {
        if (move.movedPiece % 8 === Pieces.KING && Math.abs(move.startField - move.endField) === 2) {
            this.position[(move.startField / 8) * 8 + ((move.endField % 8) / 4) * 7] = this.position[move.startField + (move.endField - move.startField) / 2];
            delete this.position[move.startField + (move.endField - move.startField) / 2];
        }
        this.position[move.startField] = move.movedPiece;
        delete this.position[move.endField];
        if (move.takenPiece > 0)
            this.position[move.takenPieceField] = move.takenPiece;
    }

    public setCastles():void {
        if (this.moves.length === 0) return;
        let lastMove:Move = this.moves[this.moves.length - 1];
        if (lastMove.movedPiece % 8 === Pieces.KING) {
            for (let i = lastMove.movedPiece > 16 ? 0 : 2; i - (lastMove.movedPiece > 16 ? 0 : 2) < 2; i++) {
                if (this.availableCastles[i] === 0)
                    this.availableCastles[i] = this.moves.length;

            }
            return;
        }
        if (lastMove.movedPiece === Pieces.ROOK) {
            for (let i = 0; i < this.availableCastles.length; i++) {
                if (this.availableCastles[i] === 0 && lastMove.startField === (7 * (i % 2)) + (i / 2) * 56) {
                    this.availableCastles[i] = this.moves.length;
                    return;
                }
            }
        }
    }

    public unsetCastles():Array<number> {
        for (let i = 0; i < this.availableCastles.length; i++) {
            if (this.availableCastles[i] > this.moves.length)
                this.availableCastles[i] = 0;
        }
        return this.availableCastles;
    }

    public makeMove(move:Move):void{
        this.movePiece(move);
        this.setCastles();
        this.moves.push(move);
        this.positions.push({...this.position});
        if(this.movedPieces[move.startField] === 0){
            this.movedPieces[move.startField] = this.moves.length;
        }
    }

    public unMakeMove(move:Move):void{
        this.unMovePiece(move);
        this.unsetCastles();
        this.removeLastMove();
        delete this.positions[this.positions.length-1];
        if(this.movedPieces[move.startField] > 0 && this.movedPieces[move.startField] < this.moves.length){
            this.movedPieces[move.startField] = 0;
        }
    }

    public  isEndgame():boolean {
        if (!((Pieces.QUEEN + Pieces.WHITE) in this.position) && !((Pieces.QUEEN + Pieces.BLACK) in this.position))
            return true;

        if (((Pieces.QUEEN + Pieces.WHITE) in this.position)) {
            let minorPieces:boolean = false;

            Object.entries(this.position).forEach(([key, value]) => {
                if (value < 16) {
                    if (value % 8 === Pieces.ROOK)
                        return false;
                    if (value % 8 === Pieces.KNIGHT || value % 8 === Pieces.BISHOP) {
                        if (minorPieces === true)
                            return false;
                        minorPieces = true;
                    }
                }
            })

        }

        if ((Pieces.QUEEN + Pieces.BLACK) in this.position) {
            let minorPieces:boolean = false;

            Object.entries(this.position).forEach(([key, value]) => {
                if (value >= 16) {
                    if (value % 8 === Pieces.ROOK)
                        return false;
                    if (value % 8 === Pieces.KNIGHT || value % 8 === Pieces.BISHOP) {
                        if (minorPieces === true)
                            return false;
                        minorPieces = true;
                    }
                }
            })
        }

        return true;
    }

    private resetMovedPieces():void{
        for(let i = 0; i < this.movedPieces.length; i++){
            if(i in this.position)
                this.movedPieces[i] = 0;
            else this.movedPieces[i] = -1;
        }
    }

    public getLastMove():Move{
        return this.moves.length > 0 ? this.moves[this.moves.length] : new Move({});
    }

    public removeLastMove():void{ if(this.moves.length>0) delete this.moves[this.moves.length-1];}

    public getPositionCopy():{[key:number]:number}{
        return {...this.position};
    }

    public findKing():number {
        let position:number = -1;

        for(const [key, value] of Object.entries(this.position))
        {
            if (key in this.position && this.position[Number(key)] % 8 === Pieces.KING && this.isWhite(Number(key)) === this.whiteToMove)
                return Number(key);
        }

        return position;
    }

    public isMate = ():boolean =>{

        for(const [key, value] of Object.entries(this.getPositionCopy())){
            if(value < 16 === this.whiteToMove) {
                let squares:Array<number> = this.PossibleMoves(Number(key));
                squares = this.deleteImpossibleMoves(squares, Number(key));
                if (squares.length > 0)
                    return false;
            }
        }
        if(this.isChecked() === -1)
            return false;
      return true;
    }

    public isStalemate():boolean{
        for(const [key, value] of Object.entries(this.getPositionCopy())){
            if(value > 16 && !this.whiteToMove || value < 16 && this.whiteToMove)
                if(this.deleteImpossibleMoves(this.PossibleMoves(Number(key)), Number(key)).length > 0) return false;
        }
        if(this.isChecked() != -1) return false;
        return true;
    }

    public isThreefold():boolean{
        if(this.positions.length < 5) return false;
        let currentPos:{[key:number]:number} = this.position;

        let repetitions:number = 0;

        f: for(const position of this.positions){
            for(const [key, value] of Object.entries(position)){
                if(!(key in currentPos) || currentPos[Number(key)] != value) continue f;
            }
            repetitions++;
            if(repetitions === 3){
                return true;
            }
        }
        return false;
    }

    public draw50MoveRuleCheck(){
        if(this.getLastMove().movedPiece === Pieces.PAWN || this.getLastMove().takenPiece != 0) return 0;
        this.movesTo50MoveRule++;
    }

    public draw50MoveRule():boolean{
        if(this.movesTo50MoveRule === 100)
            return true;
        return false;
    }

    public insufficientMaterial():boolean{
        if(Object.keys(this.position).length>4) return false;
        if(Object.keys(this.position).length === 2) return true;
        if((Pieces.PAWN | Pieces.WHITE) in this.position || (Pieces.PAWN | Pieces.BLACK) in this.position) return false;
        let blackKnights:number = 0;
        let whiteKnights:number = 0;
        let blackBishops:Array<number> = new Array();
        let whiteBishops:Array<number> = new Array();
            for(let [key, value] of Object.entries(this.position)){
                switch (value){
                    case Pieces.KNIGHT | Pieces.WHITE: whiteKnights++; break;
                    case Pieces.KNIGHT | Pieces.BLACK: blackKnights++; break;
                    case Pieces.BISHOP | Pieces.WHITE: whiteBishops.push(Number(key)); break;
                    case Pieces.BISHOP | Pieces.BLACK: blackBishops.push(Number(key)); break;
                    default: return false;
                }
            }

            if(Object.keys(this.position).length === 3 || whiteKnights === 2 || blackKnights === 2 ) return false;

            if(whiteBishops.length === blackBishops.length||blackKnights===whiteKnights )return true;
            if(blackBishops.length===2 && (blackBishops[0] % 2 === (blackBishops[0] / 8) % 2) === (blackBishops[1] % 2 === (blackBishops[1] / 8) % 2)) return true;
            if(whiteBishops.length===2 && (whiteBishops[0] % 2 === (whiteBishops[0] / 8) % 2) === (whiteBishops[1] % 2 === (whiteBishops[1] / 8) % 2)) return true;
            return false;
    }

}