import { View, StyleSheet } from "react-native";
import React, {useState} from "react";
import { FieldInfo } from "../features/playOnline";
import ChessBoardField from "./ChessBoardField";
import BaseCustomContentButton from "./BaseCustomContentButton";
import { FontAwesome } from "@expo/vector-icons";

import { ColorsPallet } from "../utils/Constants";

type Props = {
  board: Array<FieldInfo>;
};

export default function ChessBoard({ board }: Props) {

  const handleFieldPress = (data:FieldInfo) =>{
    console.log("")
    console.log("")
    console.log("")
  
    copyPossibleMoves= Array.from(possibleMoves);
  
      if(data.piece>8){
      
        setActiveField(data.fieldNumber);
        checkPossibleMoves(data)
      } else if(possibleMoves.includes(data.fieldNumber)){
        goFromTo(data.fieldNumber)
        setActiveField(-1)
        setPossibleMoves([])
      } else {
        setPossibleMoves([])
        setActiveField(-1)
      }
  }

  const [activeField, setActiveField] = useState(-2);

  
  const [possibleMoves, setPossibleMoves] = useState([-1])
  let copyPossibleMoves : Number[] = [0];

  const checkPossibleMoves = (info:FieldInfo) =>{
    setPossibleMoves([])
   
      switch (info.piece){
        
        case 9: 
        setPossibleMoves([info.fieldNumber-8-1, info.fieldNumber-8, info.fieldNumber-8 +1,  info.fieldNumber-1, info.fieldNumber+1, info.fieldNumber+8-1, info.fieldNumber+8, info.fieldNumber+8+1]);
         break;
        case 10: //white queen
       
        {
       for(let i=info.fieldNumber-8; i>=0; i-=8){
        if(board[i].piece!=0) break;
        setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
        }
        for(let i=info.fieldNumber+8; i<=63; i+=8){
          if(board[i].piece!=0) break;
          setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
        }
        for(let i=info.fieldNumber-1; i>=info.fieldNumber-(info.fieldNumber%8); i--){
          if(board[i].piece!=0) break;
          setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
        }
        for(let i=info.fieldNumber+1; i<=info.fieldNumber+7-(info.fieldNumber%8); i++){
          if(board[i].piece!=0) break;
          setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
        }
        }
      
        break;
        case 11: //white rook
        {
        for(let i=info.fieldNumber-8; i>=0; i-=8){
          if(board[i].piece!=0) break;
          setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
          }
          for(let i=info.fieldNumber+8; i<=63; i+=8){
            if(board[i].piece!=0) break;
            setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
          }
          for(let i=info.fieldNumber-1; i>=info.fieldNumber-(info.fieldNumber%8); i--){
            if(board[i].piece!=0) break;
            setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
          }
          for(let i=info.fieldNumber+1; i<=info.fieldNumber+7-(info.fieldNumber%8); i++){
            if(board[i].piece!=0) break;
            setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
          }
        }
        break;
        case 12: //white bishop
        for(let i=info.fieldNumber-9; i>=0; i-=9){
          setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
        }
        for(let i=info.fieldNumber-7; i>=0; i-=7){
          setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
        }
        for(let i=info.fieldNumber+7; i<=63; i+=7){
          setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
        }
        for(let i=info.fieldNumber+9; i<=63; i+=9){
          setPossibleMoves(prevMoves => [...prevMoves, board[i].fieldNumber]);
        }
        break;
        case 13: //white horse
        setPossibleMoves([info.fieldNumber-16-1, info.fieldNumber-16+1, info.fieldNumber-8-2,info.fieldNumber-8+2,info.fieldNumber+16-1, info.fieldNumber+16+1, info.fieldNumber+8-2,info.fieldNumber+8+2])
        break;
        case 14: //white pawn
        setPossibleMoves([info.fieldNumber-16, info.fieldNumber-8]); 
      
        break;
        
      }
    
    }
  
 

  const goFromTo = (afterField:number) =>{
    
    if(activeField>=0)
    {
      {
      let piece = board[activeField].piece;
      let fieldNumber = afterField;
      board[afterField] = {piece, fieldNumber};
      }
      {
        let piece = 0;
        let fieldNumber = activeField;
        board[activeField] = {piece, fieldNumber}
      }
     
    }
  }



  let backgroundColor: string;

const setBackgroundColor = (info:FieldInfo) =>{

  backgroundColor =
  (info.fieldNumber % 2 === 0 &&
    Math.floor(info.fieldNumber / 8) % 2 === 0) ||
  (info.fieldNumber % 2 === 1 && Math.floor(info.fieldNumber / 8) % 2 === 1)
    ? ColorsPallet.light
    : ColorsPallet.dark;

  if(info.fieldNumber==activeField){
   backgroundColor=(backgroundColor==ColorsPallet.light) ? ColorsPallet.baseColor: ColorsPallet.darker
  } else if(info.fieldNumber==copyPossibleMoves[0]) {
    backgroundColor="rgb(163, 125, 82)";
    copyPossibleMoves.shift();
  }
}

  
  const renderBoard = () => {
    const renderedBoard = [];
   
    for (let i = 0; i < 64; i++) {
      setBackgroundColor(board[i])
      renderedBoard.push(<ChessBoardField key={i} info={board[i]} handleFieldPress={handleFieldPress} backgroundColor={backgroundColor}/>);

    }
    copyPossibleMoves = []
    
    return renderedBoard;
  };
  possibleMoves.sort((a,b)=>a-b)
  copyPossibleMoves= possibleMoves.filter((value) => value >= 0);

  console.log(possibleMoves)
  console.log(copyPossibleMoves)
  const renderedBoard = renderBoard();
  
  return <View style={styles.container}>{renderedBoard}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
  },
});
