export type registerRequestType = {
  firstName: string;
  lastName: string;
  nick: string;
  email: string;
  password: string;
};

export type loginRequestType = {
  email: string;
  password: string;
};
