export const handleFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(url, options)
  .then(response => {
    if(response.status === 100){
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