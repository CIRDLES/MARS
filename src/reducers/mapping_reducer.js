import {CHANGE_SOURCE_FILE, CHANGE_MAP_FILE} from '../actions/mapping'

export default function(state={}, action){
    switch (action.type){
        case CHANGE_SOURCE_FILE:
            return {...state, sourceFiles: action.sourceFiles}
        case CHANGE_MAP_FILE:
            return {...state, mapFile: action.mapFile}
        default:
            return state;   
    }
}