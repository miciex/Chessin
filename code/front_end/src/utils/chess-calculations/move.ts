import { Pieces } from "./ChessConstants";

type constructorArgs = {
    pieces?:{[key:number]:number},
    startField?:number,
    endField?:number,
    promotePiece?:number,
    continuations?:Move[],
    move?:Move
}

export class Move {
    public movedPiece:number = 0;
    public startField:number = 0;
    public endField:number = 0;
    public takenPiece = 0;
    public promotePiece:number = 0;
    public gaveCheck:boolean = false;
    public takenPieceField:number = 0;
    public continuations: Move[] = [];
    
    constructor({pieces, startField, endField, promotePiece, move, continuations}:constructorArgs){
        this.startField = startField?startField:(move?move.startField:0);
        this.endField = endField?endField:(move?move.endField:0);
        this.movedPiece = pieces&&startField?pieces[startField]:(move?move.movedPiece:0);
        this.takenPiece = move?move.movedPiece:(pieces?this.calcTakenPiece(pieces):0);
        this.takenPieceField = move?move.takenPieceField:(pieces?this.calcTakenPieceField(pieces):0);
        this.promotePiece = promotePiece?promotePiece:(move?move.promotePiece:0);
        this.continuations = continuations?continuations:[];
    }
    
    private calcTakenPiece(pieces:{[key:number]:number}):number{
        if(this.endField in pieces) return pieces[this.endField];
        if((this.movedPiece%8) === Pieces.PAWN && (this.startField - this.endField) % 8 != 0)
            return Pieces.PAWN + (this.movedPiece > 16 ? Pieces.WHITE : Pieces.BLACK);
        return 0;
    }

    private calcTakenPieceField(pieces:{[key:number]:number}):number{
        if(this.takenPiece == 0)  return -1;
        if(this.movedPiece%8 == Pieces.PAWN && !(this.endField in pieces))
                return this.startField + this.endField % 8 - this.startField % 8;
        return this.endField;
    }
}