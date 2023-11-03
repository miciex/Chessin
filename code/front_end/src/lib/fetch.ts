import { getValueFor } from "../utils/AsyncStoreFunctions";

export const handleFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(url, options)
  .then(response => {
    if(response.status === 202){
      return null;
    }
    if(response.status === 200) {
        return response.json()
    }
    else if(response.status === 400){
        throw new Error('Bad Request')
    }
    else if(response.status===404){
        throw new Error('Not Found')
    }
  }).catch(error => {
    throw new Error(error)
  });
}

export const handlePost = async (url: string, body?: string) => {
  const accessToken = await getValueFor("accessToken").catch(() => {
    throw new Error(
      "Couldn't get board, because accessToken isn't stored"
    );
  });
  return handleFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: body,
  });
}