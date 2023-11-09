export const baseLink = "http://192.168.10.114:8080/api/v1/";
export const authLink = `${baseLink}auth/`;
export const registerLink = `${authLink}register`;
export const authenticateLink = `${authLink}authenticate`;
export const refreshTokenLink = `${authLink}refreshToken`;
export const verifyCodeLink = `${authLink}verifyCode`;
export const changePasswordLink = `${authLink}changePassword`;
export const remindPasswordLink = `${authLink}remindPassword`;
export const twofaEnabledLink = `${authLink}2faEnabled`;
export const userLink = `${baseLink}user/`;
export const findByNicknameLink = `${userLink}findByNickname/`;
export const setActive = `${userLink}setActive`;
export const checkInvitationsLink = `${userLink}checkInvitations`;
export const checkSendedInvitationsLink = `${userLink}getInvitations`;
export const respondtoInvitationLink = `${userLink}respondToInvitation`;
export const removeFriendLink = `${userLink}removeFriend`;
export const removeInvitationLink = `${userLink}removeInvitation`;
export const findUserbyTokenLink = `${userLink}findUserByToken`;
export const chessGameLink = `${baseLink}game/`;
export const searchNewGameLink = `${chessGameLink}searchNewGame`;
export const cancelSearchLink = `${chessGameLink}cancelSearch`;
export const submitMoveLink = `${chessGameLink}submitMove`;
export const gameInvitation = `${chessGameLink}respondToGameInvitation`;
export const addFriendLink = `${userLink}addFriend`;
export const listenForFirstMoveLink = `${chessGameLink}listenForFirstMove/`;
export const getGameByUsernameLink = `${chessGameLink}getGameByUsername/`;
export const listenForMoveLink = `${chessGameLink}listenForMove`;
export const findUsersByNickname = `${userLink}findUsersByNickname/`;
export const getFriends = `${userLink}getFriends/`;
export const getUsersByNicknameLink = `${userLink}getUsersByNickname/`;
export const getBoardbyGameIdLink = `${chessGameLink}getBoardByGameId/`;
export const getGameHistoryLink = `${userLink}getGames/`;
export const getGameByIdLink = `${chessGameLink}getGame/`;
export const inviteToGameLink = `${chessGameLink}inviteFriend`;
export const checkInvitationsToGameLink = `${chessGameLink}checkGameInvitations`;
export const listenForDrawOfferLink = `${chessGameLink}listenForDrawOffer/`;
export const offerDrawLink = `${chessGameLink}offerDraw/`;
export const respondToDrawOfferLink = `${chessGameLink}respondToDrawOffer`;
export const listenForResignationLink = `${chessGameLink}listenForResignation/`;
export const resignLink = `${chessGameLink}resign/`;
export const getBoardByUsernameLink = `${chessGameLink}getBoardByUsername/`;
export const isUserPlayingLink = `${chessGameLink}isUserPlaying/`;
export const isUserPlayingTimeControlLink = `${chessGameLink}isUserPlayingTimeControl/`;
export const pingLink = `${chessGameLink}ping/`;
export const listenForDisconnectionLink = `${chessGameLink}listenForDisconnection/`;
