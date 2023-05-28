export type User = {
    name: String;
    email: String;
    nameInGame: String;
    country: string;
    ranking: Rankings;
    highestRanking: number;
};

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

export const getHighestRanking = (rankings: Rankings) => {
    const rankingValues = Object.values(rankings);
    const highestRanking = Math.max(...rankingValues);
    return highestRanking;
}