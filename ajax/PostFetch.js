
import { AsyncStorage } from 'react-native';
import NetworkUtils from "../common/globalfunc"
import Toast from 'react-native-simple-toast';


// let BASE_URL = "https://www.jobma.com"
// let APIS_URL = "https://www.jobma.com:9000/v5/employer/" 

let BASE_URL = "https://testing.jobma.com"
let APIS_URL = "https://testing.jobma.com:8090/v5/employer/" 


export default async function PostFetch(name, payload, header = null, method = null) {
  let check_connection = await NetworkUtils.isNetworkAvailable()
  if (check_connection) {
    let url = APIS_URL + name
    console.log(url,"ll")
    console.log(payload, name)

    let jsonD = [];
    let m = 'POST';
    if (method !== null) {
      m = method;
    }
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'key': 'oOOC1MCtz4jTuSWk8mn6BuVC83PRIR1512477086'
    };
    if (header !== null) {
      headers = header
    }

    await fetch(url, {
      method: m,
      headers: headers,
      body: JSON.stringify(payload)
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        // console.log(payload)

        jsonD = responseJSON;
        //  console.log(jsonD)
      })
      .catch((err) => {
        console.log(err)
        Toast.showWithGravity("Something went wrong", Toast.LONG, Toast.BOTTOM);
        jsonD = null;
      });
     
    return jsonD;
  }
  else {
    Toast.showWithGravity("Check your internet connection", Toast.LONG, Toast.BOTTOM);
    return null
  }

}

export const URL = {"base_url":BASE_URL,"api_url":APIS_URL}