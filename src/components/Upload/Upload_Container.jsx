import { connect } from 'react-redux'
import Worker from '../helpers/sandbox.worker'
import * as actions from '../../actions/upload'
import Upload from './Upload'

function mapStateToProps(state) {
    return { 
        mapFile: state.mapping.mapFile, 
        sourceFiles: state.mapping.sourceFiles, 
        user: state.auth, 
        uploadSamples: state.upload.samples,
        loading: state.upload.loading
    };
}

function mapDistatchToProps(dispatch){
    return {
        onUpload: (sourceMap, uploadSamples, user) => {
            let worker = Worker()
            worker.postMessage({type:'combine', sourceMap, uploadSamples})
            worker.onmessage = (e) => {
                dispatch(actions.upload(user.username, user.password, user.usercode, e.data))
            }
        },

        deleteSamples: (remove) => {dispatch(actions.deleteSamples(remove))}

    }
}

const UploadContainer = connect(mapStateToProps, mapDistatchToProps)(Upload)
export default(UploadContainer)