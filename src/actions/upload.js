import axios from 'axios'
import toXML from './toXML'
import FormData from 'form-data'
import convert from 'xml-to-json-promise'

export const INITIALIZE_SAMPLES = 'initialize_samples';
export const UPLOAD_REQUEST = 'upload_request';
export const UPLOAD_SUCCESS = 'upload_success';
export const UPLOAD_FAILURE = 'upload_failure';

export function initializeSamples(sampleArray){
  return {
    type: INITIALIZE_SAMPLES,
    sampleArray: sampleArray
  }
}

export function uploadRequest() {
  return {
    type: UPLOAD_REQUEST
  }
}

// All samples uploaded correctly
export function uploadSuccess(results, selectedSamples) {
  return {
    type: UPLOAD_SUCCESS,
    results,
    selectedSamples
  }
}

// Not all samples uploaded correctly
export function uploadFailure(error) {
  return {
    type: UPLOAD_FAILURE,
    error
  }
}

export function upload(username, password, usercode, samples, selectedSamples) {
  return async dispatch => {
    try {

      //Start upload request
      dispatch(uploadRequest())
      
      let samplesToUpload = []
      for (let i = 0; i < selectedSamples.length; i++){
        let index = selectedSamples[i]
        samplesToUpload[i] = samples[index]
      }
      //convert samples to xml scheme
      let xmlSample = toXML(samplesToUpload, usercode)

      //TODO: Validate each sample
      //create form data to use in the POST request
      let formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('content', new XMLSerializer().serializeToString(xmlSample))

      //POST request
      const res = await axios.post('https://sesardev.geosamples.org/webservices/upload.php', formData)

      //convert the response data from xml to JSON
      convert.xmlDataToJSON(res.data, {explicitArray: true}).then(json => {
        dispatch(uploadSuccess(json.results.sample, selectedSamples))
      });
  } catch(error){
    console.log(error)
    dispatch({type: UPLOAD_FAILURE,error});
    }
  }
}