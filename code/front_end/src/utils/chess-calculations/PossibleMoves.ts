import { HashMap } from "../Types";
import { Move } from "../../features/playOnline";
import { GameResults } from "./ChessTypes";



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
}