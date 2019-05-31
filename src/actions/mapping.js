export const CHANGE_SOURCE_FILE = 'change_source_file';
export const CHANGE_MAP_FILE = 'change_map_file';

  
  export function onChangeSourceFileAction(sourceFiles){
    return {
      type: CHANGE_SOURCE_FILE,
      sourceFiles: sourceFiles
    }
  }
  
  export function onChangeMapFileAction(mapFile){
    return {
      type: CHANGE_MAP_FILE,
      mapFile: mapFile
    }
  }