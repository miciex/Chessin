import { GameLengthTypeContextType } from "../features/gameMenuPage/context/GameLengthContext";
import { loggedUserResponse } from "./ServicesTypes";

export type User = {
    firstname: string;
    lastname: string;
    email: string;
    nameInGame: string;
    country: string;
    ranking: Rankings;
    highestRanking: number;
    online?: boolean;
    playing?:boolean;
};

export type responseUser = {
    id: number;
    firstname: string;
    lastname: string;
    nameInGame: string;
    password: string;
    role: string;
    ratingBlitz: number;
    ratingBullet: number;
    ratingRapid: number;
    ratingClassical: number;
    country: string;
}

export type Player = {
    firstname: string;
    lastname: string;
    email: string;
    nameInGame: string;
    country: string;
    ranking: Rankings;
    highestRanking: number;
    online?: boolean;
    color: playColor;
    timeLeft:Date | null;
};

export type playColor = "white" | "black" | "spectator" | null;

export type Rankings = {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
};

export const getBasePlayer = (): Player => {
    return {
        firstname: "",
        lastname: "",
        email: "",
        nameInGame: "",
        country: "",
        ranking: {
            bullet: 0,
            blitz: 0,
            rapid: 0,
            classical: 0,
        },
        highestRanking: 0,
        color: null,
        timeLeft: null,
    }
}

export const responseUserToUser = (responseUser: responseUser, email:string): User => {
    
    const rankings:Rankings = {
        bullet: responseUser.ratingBullet,
        blitz: responseUser.ratingBlitz,
        rapid: responseUser.ratingRapid,
        classical: responseUser.ratingClassical,
    }
    
    return {
        firstname: responseUser.firstname,
        lastname: responseUser.lastname,
        email: email,
        nameInGame: responseUser.nameInGame,
        country: responseUser.country,
        ranking: rankings,
        highestRanking: getHighestRanking(rankings),
    }
} 

export const loggedUserToUser = (loggedUser: loggedUserResponse): User => {
    const rankings:Rankings = {
        bullet: loggedUser.ratingBullet,
        blitz: loggedUser.ratingBlitz,
        rapid: loggedUser.ratingRapid,
        classical: loggedUser.ratingClassical,
    }

    return {
        firstname: loggedUser.firstname,
        lastname: loggedUser.lastname,
        email: loggedUser.email,
        nameInGame: loggedUser.nameInGame,
        country: loggedUser.country,
        ranking: rankings,
        highestRanking: getHighestRanking(rankings),
    }
}

export const responseUserToPlayer = (responseUser: responseUser, color: playColor, email?:string): Player => {
    const rankings:Rankings = {
        bullet: responseUser.ratingBullet,
        blitz: responseUser.ratingBlitz,
        rapid: responseUser.ratingRapid,
        classical: responseUser.ratingClassical,
    }
    return {
        firstname: responseUser.firstname,
        lastname: responseUser.lastname,
        email: email ? email : "",
        nameInGame: responseUser.nameInGame,
        country: responseUser.country,
        ranking: rankings,
        highestRanking: getHighestRanking(rankings),
        color: color,
        timeLeft: null,
    }
}

export const userToPlayer = (user: User, color: playColor): Player => {
    return {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        nameInGame: user.nameInGame,
        country: user.country,
        ranking: user.ranking,
        highestRanking: user.highestRanking,
        online: user.online,
        color: color,
        timeLeft: null,
    }
}



export const getHighestRanking = (rankings: Rankings) => {
    const rankingValues = Object.values(rankings);
    const highestRanking = Math.max(...rankingValues);
    return highestRanking;
}

export const getRanking = (gameLength: GameLengthTypeContextType, user: User) => {
    switch (gameLength) {
        case "bullet":
            return user.ranking.bullet;
        case "blitz":
            return user.ranking.blitz;
        case "rapid":
            return user.ranking.rapid;
        case "classical":
            return user.ranking.classical;
        default:
            return user.highestRanking;
    }
}