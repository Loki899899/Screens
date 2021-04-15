
import {AsyncStorage} from 'react-native'
import {URL} from "../ajax/PostFetch"

export default async function GetFetch(name, header=null, offset = null, limit =null){
    let uri = ''
    if(limit==null&&offset==null){
      uri=URL.api_url+name
    }
    else{
      uri = URL.api_url+ name, "?offset="+offset+"&limit="+limit +""

    }
    let jsonD = [];
    let token = await AsyncStorage.getItem('token')
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'key': token
    };
   
    await fetch(uri, {
      method: 'GET',
      headers: headers
    })
    .then((response) => response.json())
    .then((responseJSON) => {
       jsonD = responseJSON;
    }).catch((err) =>{
        console.log("00000")
        jsonD = null;
    });
    return jsonD;
  }