import { searchNewGameLink, submitMoveLink, cancelSearchLink, listenForFirstMoveLink } from "../../../utils/ApiEndpoints";
import { getValueFor } from "../../../utils/AsyncStoreFunctions";
import { PendingChessGameRequest, SubmitMoveRequest, ListenForFirstMoveRequest } from "../../../utils/ServicesTypes";
import { searchRatingRange } from "../../../utils/Constants";

export const listenForFirstMove = async (request: ListenForFirstMoveRequest) => {
    const accessToken = await getValueFor("accessToken");

    const response  = await fetch(listenForFirstMoveLink, {
        method: "Post",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
    }).then((response) => {
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
            response.text().then((data) => {
                throw new Error(data);
        })
        .catch((error) => {
            throw new Error(error);
        });
    }else{
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
    console.log("submit move request: ",request);
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
            console.log("submit move error: ",response);
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