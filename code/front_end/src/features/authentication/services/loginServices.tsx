import { findUserbyTokenLink } from "../../../utils/ApiEndpoints";
import { User, loggedUserToUser } from "../../../utils/PlayerUtilities";
import { save } from "../../../utils/AsyncStoreFunctions";
import { loggedUserResponse } from "../../../utils/ServicesTypes";
import { handlePost } from "../../../lib/fetch";

export const fetchandStoreUser = async () => {
  return fetchLoggedUser()
    .then((data) => {
      let user: User = loggedUserToUser(data);
      save("user", JSON.stringify(user))
        .then(() => {
          return user;
        })
        .catch(() => {
          throw new Error("Couldn't save user");
        });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

export const fetchLoggedUser = async () => {
  return handlePost(findUserbyTokenLink).catch((err) => {
    throw new Error(err);
  }) as unknown as loggedUserResponse;
};
