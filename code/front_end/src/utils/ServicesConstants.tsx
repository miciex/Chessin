export const baseLink = "http:/<IP>:8080/api/v1/";
export const authLink = `${baseLink}auth/`;
export const registerLink = `${authLink}register`;
export const authenticateLink = `${authLink}authenticate`;
export const refreshTokenLink = `${authLink}refreshToken`;
export const verifyCode = `${authLink}verifyCode`;
export const getUser = `${baseLink}users/get/`;
