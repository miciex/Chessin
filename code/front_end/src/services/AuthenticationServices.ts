import { CodeVerificationRequest, RegisterRequest, LoginRequest, PasswordChangeRequest, PasswordRemindRequest, TwoFactorAuthenticationEnabledRequest } from "../utils/ServicesTypes";
    import { verifyCodeLink, registerLink, authenticateLink, changePasswordLink, remindPasswordLink, twofaEnabledLink } from "../utils/ApiEndpoints";

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
        throw new Error(error);
    });
    return response;
}

export const changePassword = async (changePasswordRequest: PasswordChangeRequest) => {
    const response = await fetch(changePasswordLink, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(changePasswordRequest)
    }).catch((err) => {
        throw new Error(err);
    })
    return response;
}

export const remindPassword = async (remindPasswordRequest: PasswordRemindRequest) => {
    const response = await fetch(remindPasswordLink, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(remindPasswordRequest)
    }).catch((err)=> {
        throw new Error(err);
    })
    return response;
}

export const twoFaEnabled = async (twoFaEnabledRequest: TwoFactorAuthenticationEnabledRequest) => {
    const response = await fetch(twofaEnabledLink, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(twoFaEnabledRequest)
}).catch((err)=> {
    throw new Error(err);
});
return response;
}