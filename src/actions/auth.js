
import axios from 'axios';
import * as jsCON from 'xml-js'

export const AUTHENTICATED = 'authenticated_user';
export const UNAUTHENTICATED = 'unauthenticated_user';
export const AUTHENTICATION_ERROR = 'authentication_error';

const URL = 'https://sesardev.geosamples.org/webservices/credentials_service_v2.php';

export function signInAction({ username, password }, history) {
    return async (dispatch) => {
      try {
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        const res = await axios.post(`${URL}`, formData);
  
        //Formating api response in order to get usercode
        let options = {ignoreComment: true, alwaysChildren: true};
        let resJSON = await jsCON.xml2js(res.data, options )
        let usercode = resJSON.elements[0].elements[1].elements[0].elements[0].text
  
        dispatch({ 
          type: AUTHENTICATED,
          username: username,
          usercode: usercode,
          password: password
        });
  
        history.push('/signout');
      } catch(error) {
        console.log(error)
        dispatch({
          type: AUTHENTICATION_ERROR,
          payload: 'Invalid email or password'
        });
      }
    };
};

export function signOutAction(){
    localStorage.clear();
    return {
      type: UNAUTHENTICATED
    }
  }