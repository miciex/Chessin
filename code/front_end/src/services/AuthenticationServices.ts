import {
  CodeVerificationRequest,
  LoginRequest,
  PasswordChangeRequest,
  PasswordRemindRequest,
  RegisterRequest,
  TwoFactorAuthenticationEnabledRequest,
} from "../utils/ServicesTypes";
import {
  authenticateLink,
  changePasswordLink,
  registerLink,
  remindPasswordLink,
  twofaEnabledLink,
  verifyCodeLink,
} from "../utils/ApiEndpoints";

export const verifyCode = async (
  codeVerificationRequest: CodeVerificationRequest
) => {
  return await fetch(verifyCodeLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(codeVerificationRequest),
  }).catch((error) => {
    throw new Error(error.message);
  });
};

export const register = async (registerRequest: RegisterRequest) => {
  return await fetch(registerLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerRequest),
  }).catch((error) => {
    throw new Error(error.message);
  });
};

export const login = async (loginRequest: LoginRequest) => {
  return await fetch(authenticateLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
  }).catch((error) => {
    throw new Error(error);
  });
};

export const changePassword = async (
  changePasswordRequest: PasswordChangeRequest
) => {
  return await fetch(changePasswordLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changePasswordRequest),
  }).catch((err) => {
    throw new Error(err);
  });
};

export const remindPassword = async (
  remindPasswordRequest: PasswordRemindRequest
) => {
  return await fetch(remindPasswordLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(remindPasswordRequest),
  }).catch((err) => {
    throw new Error(err);
  });
};

export const twoFaEnabled = async (
  twoFaEnabledRequest: TwoFactorAuthenticationEnabledRequest
) => {
  return await fetch(twofaEnabledLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(twoFaEnabledRequest),
  }).catch((err) => {
    throw new Error(err);
  });
};
