import {UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE, INITIALIZE_SAMPLES} from '../actions/upload'

export default function reducer(state = {}, action) {
  switch(action.type) {
    case INITIALIZE_SAMPLES:
        console.log("<==== Samples Ready ====>")
        return {...state, samples: action.sampleArray, loading: false}
    case UPLOAD_REQUEST:
        console.log("<==== Upload Requested ====>")
      return {...state, loading: true}
    case UPLOAD_SUCCESS:
      let results = action.results
      let samples = state.samples
      let selectedSamples = action.selectedSamples

      //Add the IGSNs to each sample
      for(let i=0; i<results.length; i++) {
        let index = selectedSamples[i].id
        let igsn = {originalKey: '', originalValue: '', key:'igsn', value:results[i].igsn} //IGSN for each sample
        samples[index][0] = igsn //for each sample, the sample is equal to its previous version with IGSN added to the end
      }
      //TODO: enable exporting to CSV after successful upload
      console.log("<==== Upload Succcessful ====>")
      return {...state, samples: samples, loading: false}
    case UPLOAD_FAILURE:
      console.log("<==== Upload Failure ====>")
      return {...state, loading: false}
    default:
      return state
  }
}