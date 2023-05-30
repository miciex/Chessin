import { Pieces } from "./ChessConstants";
import { Char } from "../Types";


export const getPieceValue = (piece:number):number=>{
    switch (piece % 8){
        case Pieces.PAWN: return Pieces.PawnValue;
        case Pieces.KNIGHT: return Pieces.KnightValue;
        case Pieces.BISHOP: return Pieces.BishopValue;
        case Pieces.ROOK: return Pieces.RookValue;
        case Pieces.QUEEN: return Pieces.QueenValue;
        default: return 0;
    }
}

export const CharPieceToInt = (p:string):number =>{
    switch (p.toLowerCase()){
        case 'q':
            return Pieces.QUEEN + addPieceColorValue(p);
        case 'k':
            return Pieces.KING + addPieceColorValue(p);
        case 'p':
            return Pieces.PAWN + addPieceColorValue(p);
        case 'r':
            return Pieces.ROOK + addPieceColorValue(p);
        case 'n':
            return Pieces.KNIGHT + addPieceColorValue(p);
        case 'b':
            return Pieces.BISHOP  + addPieceColorValue(p);
        default: return 0;
    }
}

export const addPieceColorValue = (p:string):number =>{
    return (p.toUpperCase() === p?Pieces.WHITE:Pieces.BLACK);
}

export const FenToIntArray = (fen:string, arrayLength:number):Array<number> =>{
    let num:number = 0;
    let arr:Array<number> = new Array(arrayLength).fill(0);
    for(let currChar of [...fen]){
        if(currChar=='/' ){
            continue;
        }

        if(!Number.isNaN(Number(currChar))){
            let max = Number(currChar);
            for(let i = 0; i<max; i++){
                arr[num] = Pieces.NONE;
            }
            num+=max;
            continue;
        }

        arr[num] = CharPieceToInt(currChar);
        num++;

    }
    console.log(arr);
    return arr;
}

export const boardToMap = (board:Array<number>):{[key:number]:number}=>{
   let map:{[key:number]:number} = {};
    for(let i = 0; i<board.length; i++){
        if(board[i] != 0)
            map[i] =  board[i];
    }
    return map;
}

export const mapToBoard = (map:{[key:number]:number}):Array<number>=>{
    let board:Array<number> = new Array(64).fill(0);
    Object.entries(map).forEach(([key, value])=>{
        board[parseInt(key)] = value;
    })
    return board;
}