import { searchNewGameLink, submitMoveLink } from "../../../utils/ApiEndpoints";
import { getValueFor } from "../../../utils/AsyncStoreFunctions";
import { PendingChessGameRequest, SubmitMoveRequest } from "../../../utils/ServicesTypes";
import { searchRatingRange } from "../../../utils/Constants";


export const searchForGame = async (request: PendingChessGameRequest) => {
    const accessToken = await getValueFor("accessToken");

    return await fetch(searchNewGameLink, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
    }).then((response) => {
        console.log("search for game: ",response.status);
        if (response.status === 200) {
            return response.json();
        } else if(response.status === 400){
            response.json().then((data) => {
                throw new Error(data);
        })}else{
            throw new Error("Something went wrong");
        }
    })
    .catch((error) => {
        throw new Error(error);
    }
    );
};

export const setPendingGameRequest = (email: string, timeControl: number, increment: number, userRating: number):PendingChessGameRequest => {
    return {
        email: email,
        timeControl: timeControl,
        increment: increment,
        userRating: userRating,
        topRating: userRating + searchRatingRange,
        bottomRating: userRating - searchRatingRange,
    };
}

export const submitMove = async ( request: SubmitMoveRequest ) => {
    const accessToken = await getValueFor("accessToken");
    return await fetch(submitMoveLink, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
    }).then((response) => {
        console.log("submit move: ",response.status);
        if (response.status === 200) {
            return response.json();
        } else if(response.status === 400){
            response.json().then((data) => {
                throw new Error(data);
        })}else{
            throw new Error("Something went wrong");
        }
    }
    ).catch((error) => {
        throw new Error(error);
    }
    );
}