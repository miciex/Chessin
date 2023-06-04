import { Pieces } from "./ChessConstants";

type constructorArgs = {
    pieces?:{[key:number]:number},
    startField?:number,
    endField?:number,
    promotePiece?:number,
    continuations?:Move[],
    move?:Move,
    movedPiece?:number
}

export type MoveResponse = {
    movedPiece:number;
     startField:number;
     endField:number;
     takenPiece:number;
     promotePiece:number;
     gaveCheck:boolean;
     takenPieceField:number;
}


export type Move = {
     movedPiece:number;
     startField:number;
     endField:number;
     takenPiece:number;
     promotePiece:number;
     gaveCheck:boolean;
     takenPieceField:number;
     continuations: Move[];
}
    
    export const moveFactory = ({pieces, startField, endField, movedPiece,promotePiece, move, continuations}:constructorArgs):Move =>{
        const startF = startField?startField:(move?move.startField:0);
        const endF = endField?endField:(move?move.endField:0);
        const movedP = movedPiece?movedPiece:(pieces&&startField?pieces[startField]:(move?move.movedPiece:0));
        const takenP = move?move.movedPiece:(pieces?calcTakenPiece(pieces, startF, endF, movedP):0);

        return {
        startField: startF,
        endField: endF,
        movedPiece: movedP,
        takenPiece: takenP,
        takenPieceField: move?move.takenPieceField:(pieces?calcTakenPieceField(pieces, startF, endF, movedP, takenP):-1),
        promotePiece: promotePiece?promotePiece:(move?move.promotePiece:0),
        continuations: continuations?continuations:[],
        gaveCheck: move?move.gaveCheck:false
        }
    }

    export const getEmptyMove = ():Move =>{
        return {
            movedPiece:0,
            startField:0,
            endField:0,
            takenPiece:0,
            promotePiece:0,
            continuations:[],
            gaveCheck:false,
            takenPieceField:-1
        }
    }
    
    const calcTakenPiece = (pieces:{[key:number]:number}, startField:number,endField:number, movedPiece:number):number =>{
        if(endField in pieces) return pieces[endField];
        if((movedPiece%8) === Pieces.PAWN && (startField - endField) % 8 != 0)
            return Pieces.PAWN + (movedPiece > 16 ? Pieces.WHITE : Pieces.BLACK);
        return 0;
    }

    const calcTakenPieceField = (pieces:{[key:number]:number}, startField:number, endField:number, movedPiece:number, takenPiece:number):number =>{
        if(takenPiece == 0)  return -1;
        if(movedPiece%8 == Pieces.PAWN && !(endField in pieces))
                return startField + endField % 8 - startField % 8;
        return endField;
    }
