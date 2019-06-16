import axios from 'axios'
import toXML from './toXML'
import FormData from 'form-data'
import convert from 'xml-to-json-promise'

export const INITIALIZE_SAMPLES = 'initialize_samples';
export const UPLOAD_REQUEST = 'upload_request';
export const UPLOAD_SUCCESS = 'upload_success';
export const UPLOAD_FAILURE = 'upload_failure';
export const DELETE_REQUEST = 'delete_request';
export const DELETE_FAILURE = 'delete_failure';
export const DELETE_SUCCESS = 'delete_success';

export function initializeSamples(sampleArray){
  return {
    type: INITIALIZE_SAMPLES,
    sampleArray: sampleArray
  }
}

export function deleteRequest() {
  return {
    type: DELETE_REQUEST
  }
}

export function deleteSuccess(remove) {
  return {
    type: DELETE_SUCCESS,
    remove: remove
  }
}
export function deleteFailure() {
  return {
    type: DELETE_FAILURE
  }
}

export function deleteSamples(remove){
  return async dispatch => {
    try {
      await dispatch(deleteRequest())

      for (let i = 0; i < remove.length; i++){
        remove[i] = parseInt(remove[i])
      }
      dispatch(deleteSuccess(remove))
    } catch(error) {
      dispatch(deleteFailure)
    }
  }
  /*console.log("actions")
  return {
    type: DELETE_SAMPLES,
    deleteArray: deleteArray
  }*/
}

  
export function uploadRequest() {
  return {
    type: UPLOAD_REQUEST
  }
}



// All samples uploaded correctly
export function uploadSuccess(results) {
  return {
    type: UPLOAD_SUCCESS,
    results
  }
}

// Not all samples uploaded correctly
export function uploadFailure(error) {
  return {
    type: UPLOAD_FAILURE,
    error
  }
}

export function upload(username, password, usercode, samples) {
  return async dispatch => {
    try {

      //Start upload request
      dispatch(uploadRequest())

      //convert samples to xml scheme
      let xmlSample = toXML(samples, usercode)

      //TODO: Validate each sample
      //create form data to use in the POST request
      let formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('content', new XMLSerializer().serializeToString(xmlSample))

      //POST request
      const res = await axios.post('https://sesardev.geosamples.org/webservices/upload.php', formData)

      //convert the response data from xml to JSON
      convert.xmlDataToJSON(res.data, {explicitArray: false}).then(json => {
        dispatch(uploadSuccess(json.results.sample))
      });
  } catch(error){
    console.log(error)
    dispatch({type: UPLOAD_FAILURE,error});
    }
  }
}