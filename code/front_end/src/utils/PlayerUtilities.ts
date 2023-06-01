import { GameLengthTypeContextType } from "../features/gameMenuPage/context/GameLengthContext";

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    nameInGame: string;
    country: string;
    ranking: Rankings;
    highestRanking: number;
    online?: boolean;
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
    firstName: string;
    lastName: string;
    email: string;
    nameInGame: string;
    country: string;
    ranking: Rankings;
    highestRanking: number;
    online?: boolean;
    color: playColor;
};

export type playColor = "white" | "black" | "spectator" | null;

export type Rankings = {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
};

export const responseUserToUser = (responseUser: responseUser, email:string): User => {
    
    const rankings:Rankings = {
        bullet: responseUser.ratingBullet,
        blitz: responseUser.ratingBlitz,
        rapid: responseUser.ratingRapid,
        classical: responseUser.ratingClassical,
    }
    
    return {
        firstName: responseUser.firstname,
        lastName: responseUser.lastname,
        email: email,
        nameInGame: responseUser.nameInGame,
        country: responseUser.country,
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
        firstName: responseUser.firstname,
        lastName: responseUser.lastname,
        email: email ? email : "",
        nameInGame: responseUser.nameInGame,
        country: responseUser.country,
        ranking: rankings,
        highestRanking: getHighestRanking(rankings),
        color: color,
    }
}

export const userToPlayer = (user: User, color: playColor): Player => {
    return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        nameInGame: user.nameInGame,
        country: user.country,
        ranking: user.ranking,
        highestRanking: user.highestRanking,
        online: user.online,
        color: color,
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