export const baseLink = "http:/192.168.1.128:8080/api/v1/";
export const authLink = `${baseLink}auth/`;
export const registerLink = `${authLink}register`;
export const authenticateLink = `${authLink}authenticate`;
export const refreshTokenLink = `${authLink}refreshToken`;
export const verifyCodeLink = `${authLink}verifyCode`;
export const userLink = `${baseLink}user/`;
export const findByEmailLink = `${userLink}findByEmail/`;
export const setActive = `${userLink}setActive/`;
export const chessGameLink = `${baseLink}game/`;
export const searchNewGameLink = `${chessGameLink}searchNewGame`;
export const cancelSearchLink = `${chessGameLink}cancelSearch`;
export const submitMoveLink = `${chessGameLink}submitMove`;
export const listenForFirstMoveLink = `${chessGameLink}listenForFirstMove`;