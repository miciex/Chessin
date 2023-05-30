export type User = {
    firstName: String;
    lastName: String;
    email: String;
    nameInGame: String;
    country: string;
    ranking: Rankings;
    highestRanking: number;
};

export type responseUser = {
    id: number;
    firstname: string;
    lastName: string;
    email: string;
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
    user: User;
    color: string;
};

export type Rankings = {
    bullet: number;
    blitz: number;
    rapid: number;
    classical: number;
};

export const responseUserToUser = (responseUser: any): User => {
    console.log("converting")
    console.log(responseUser);
    
    const rankings:Rankings = {
        bullet: responseUser.ratingBullet,
        blitz: responseUser.ratingBlitz,
        rapid: responseUser.ratingRapid,
        classical: responseUser.ratingClassical,
    }
    return {
        firstName: responseUser.firstname,
        lastName: responseUser.lastName,
        email: responseUser.email,
        nameInGame: responseUser.nameInGame,
        country: responseUser.country,
        ranking: rankings,
        highestRanking: getHighestRanking(rankings),
    }
} 

export const getHighestRanking = (rankings: Rankings) => {
    const rankingValues = Object.values(rankings);
    const highestRanking = Math.max(...rankingValues);
    return highestRanking;
}