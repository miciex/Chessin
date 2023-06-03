import * as SecureStore from 'expo-secure-store';

export async function save(key:any, value:any) {
    await SecureStore.setItemAsync(key, value);
  }
  
export async function getValueFor(key:any) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      // console.log("🔐 Here's your value 🔐 \n" + result);
      return result;
    } else {
      // console.log('No values stored under that key.');
      return null
    }
  }