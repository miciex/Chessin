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
import { handlePost } from "../lib/fetch";

export const verifyCode = async (
  codeVerificationRequest: CodeVerificationRequest
) => {
  handlePost(verifyCodeLink, JSON.stringify(codeVerificationRequest)).catch((error) => {
    throw new Error(error);
  });
};

export const register = async (registerRequest: RegisterRequest) => {
  handlePost(registerLink, JSON.stringify(registerRequest)).catch((error) => {
    throw new Error(error);
  });
};

export const login = async (loginRequest: LoginRequest) => {
  return handlePost(authenticateLink, JSON.stringify(loginRequest)).catch((error) => {
    throw new Error(error);
  });
};

export const changePassword = async (
  changePasswordRequest: PasswordChangeRequest
) => {
  return handlePost(changePasswordLink, JSON.stringify(changePasswordRequest)).catch((error) => {
    throw new Error(error);
  });
};

export const remindPassword = async (
  remindPasswordRequest: PasswordRemindRequest
) => {
  return handlePost(remindPasswordLink, JSON.stringify(remindPasswordRequest)).catch((error) => {
    throw new Error(error);
  });
};

export const twoFaEnabled = async (
  twoFaEnabledRequest: TwoFactorAuthenticationEnabledRequest
) => {
  return handlePost(twofaEnabledLink, JSON.stringify(twoFaEnabledRequest)).catch((error) => {
    throw new Error(error);
  });
};
