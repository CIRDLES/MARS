import { connect } from 'react-redux'
import Worker from '../helpers/sandbox.worker'
import * as mappingActions from '../../actions/mapping'
import * as uploadActions from '../../actions/upload'
import Mapping from './Mapping'

const sourceFormat = '.csv'

//Properties from application state will be set as props in Mapping.jsx
function mapStateToProps(state) {
    return { 
        mapFile: state.mapping.mapFile, 
        sourceFiles: state.mapping.sourceFiles, 
        user: state.auth
    };
}

//Actions from actions/index.js will be set as props in Mapping.jsx
function mapDistatchToProps(dispatch){
    return {
        onProceed: (sourceMap, sourceFiles) => {
            let worker = Worker();
            worker.postMessage({type: 'map', sourceMap, sourceFormat, sourceFiles});
            worker.onmessage = function(e) {
                dispatch(uploadActions.initializeSamples(e.data))
            }
        },

        onChangeMapFileAction: (file) => {dispatch(mappingActions.onChangeMapFileAction(file))},

        onChangeSourceFileAction: (files) => {dispatch(mappingActions.onChangeSourceFileAction(files))}
    }
}

const MappingContainer = connect(mapStateToProps, mapDistatchToProps)(Mapping)
export default(MappingContainer)
