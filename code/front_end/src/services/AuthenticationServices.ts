import { CodeVerificationRequest } from "../utils/ServicesTypes";
import { verifyCodeLink } from "../utils/ApiEndpoints";

export const verifyCode = async (codeVerificationRequest: CodeVerificationRequest) => {
    const response = await fetch(verifyCodeLink, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(codeVerificationRequest),
    }).then((response) => {
        if(response.status === 200) {
            return response.json();
        }else if(response.status === 400){
            throw new Error("Invalid code");
        }else{
            throw new Error("Something went wrong");
        }
    }).catch((error) => {
        throw new Error(error.message);
    });
    return response;
}
