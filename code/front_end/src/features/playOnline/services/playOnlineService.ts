import { searchNewGameLink, submitMoveLink, cancelSearchLink, listenForFirstMoveLink, getGameByUsernameLink, listenForMoveLink } from "../../../utils/ApiEndpoints";
import { getValueFor } from "../../../utils/AsyncStoreFunctions";
import { PendingChessGameRequest, SubmitMoveRequest, ListenForFirstMoveRequest, ChessGameResponse, ListenForMoveRequest, BoardResponse } from "../../../utils/ServicesTypes";
import { searchRatingRange } from "../../../utils/Constants";

export const listenForMove = async (request: ListenForMoveRequest) => {
    const accessToken = await getValueFor("accessToken");

    const response  = await fetch(`${listenForMoveLink}`, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
    }).then((response) => {
        if (response.status === 200) {
            return response.json() as Promise<BoardResponse>;
        }else if(response.status === 400){
            response.text().then((data) => {
                throw new Error(data);
        }).catch((error) => {
            throw new Error(error);
        });
    }else{
            throw new Error("Something went wrong");
        }
    }).catch((error) => {
        throw new Error(error);
    });
    return response;
};

export const getGameByUsername = async (username: string) => {
    const accessToken = await getValueFor("accessToken");
    
    const response = await fetch(`${getGameByUsernameLink}${username}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((response) => {
        if (response.status === 200) {
            return response.json() as Promise<ChessGameResponse>;
        } else if(response.status === 400){
            response.text().then((data) => {
                throw new Error(data);
        }).catch((error) => {
            throw new Error(error);
        });
    }else{
            throw new Error("Something went wrong");
        }
    }).catch((error) => {
        throw new Error(error);
    });
    return response;
};

export const listenForFirstMove = async (request: ListenForFirstMoveRequest) => {
    const accessToken = await getValueFor("accessToken");

    const response  = await fetch(`${listenForFirstMoveLink}${request.gameId}`, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    }).then((response) => {
        console.log("listen for first move response: ",response.status);
        if (response.status === 200) {
            return response.json();
        }else if(response.status === 400){
            response.text().then((data) => {
                throw new Error(data);
        }).catch((error) => {
            throw new Error(error);
        });
    }else{
            throw new Error("Something went wrong");
        }
    }).catch((error) => {
        throw new Error(error);
    });
    return response;
};

export const cancelSearch = async (email: string) => {
    const accessToken = await getValueFor("accessToken");
    
    fetch(cancelSearchLink, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email: email }),
    }).then((response) => {
        if (response.status === 200) {
            return response.json();
        }else if(response.status === 400){
            response.text().then((data) => {
                throw new Error(data);
        }).catch((error) => {
            throw new Error(error);
        });
    }else
        {
            throw new Error("Something went wrong");
        }
    }).catch((error) => {
        throw new Error(error);
    });
};

export const searchForGame = async (request: PendingChessGameRequest, username: string) => {
    const accessToken = await getValueFor("accessToken");

    const response = await fetch(searchNewGameLink, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
    })
   
    .catch((error) => {
        throw new Error(error);
    }
    );
    return response;
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
        if (response.status === 200) {
            return response.json();
        } else if(response.status === 400){
            response.text().then((data) => {
                console.log("submit move error: ",data);
        })
        .catch((error) => {
            throw new Error(error);
        });
    }else{
            throw new Error("Something went wrong");
        }
    }
    ).catch((error) => {
        throw new Error(error);
    }
    );
}