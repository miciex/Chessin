import { CodeVerificationRequest, RegisterRequest, LoginRequest } from "../utils/ServicesTypes";
import { verifyCodeLink, registerLink, authenticateLink } from "../utils/ApiEndpoints";

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

export const register = async (registerRequest: RegisterRequest) => {
    const response = await fetch(registerLink, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registerRequest),
    }).catch((error) => {
        throw new Error(error.message);
    });
    return response;
}

export const login = async (loginRequest: LoginRequest) => {
    const response = await fetch(authenticateLink, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginRequest),
    }).catch((error) => {
        throw new Error(error.message);
    });
    return response;
}