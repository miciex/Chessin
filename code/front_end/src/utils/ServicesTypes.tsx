export type registerRequestType = {
  firstName: string;
  lastName: string;
  nick: string;
  email: string;
  password: string;
};

export type authenticationRequestType = {
  email: string;
  password: string;
  verificationType: VerificationType;
};

export type AuthenticationResponse = {
  refreshToken: string;
  accessToken: string;
};

export enum VerificationType {
  REGISTER,
  AUTHENTICATE,
  CHANGE_PASSWORD,
  REMIND_PASSWORD,
  CHANGE_EMAIL,
}
