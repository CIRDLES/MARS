import React, { Component } from 'react'
import Panel from '../Panel/panel'
import './Mapping.css'



class Mapping extends Component {
  constructor(props){
    super(props);

    this.onChangeSourceFiles = this.onChangeSourceFiles.bind(this)
    this.onChangeSourceMap = this.onChangeSourceMap.bind(this)
    this.handleProceed = this.handleProceed.bind(this)
  }

  onChangeSourceMap(e){
    this.props.onChangeMapFileAction(e.target.files[0])
  }

  onChangeSourceFiles(e){
    let fileList = e.target.files
    let sourceFiles = []
    for (var i = 0; i < fileList.length; i++){
      sourceFiles[i] = fileList[i]
    }
    this.props.onChangeSourceFileAction(sourceFiles)

  }

  handleProceed(e){
    e.preventDefault()
    this.props.onProceed(this.props.mapFile, this.props.sourceFiles)
    this.props.history.push("upload")
  }
 
  render(){
    const displayProceed = () =>{
      if (this.props.mapFile && this.props.sourceFiles){
        return(
          <div>
            <button type="button" 
            className="submitButton" 
            onClick={this.handleProceed}>
              Proceed to Mapped Data
            </button>
          </div>

        )
      }
    }

    return (
      <div className='upload'>
        <Panel name='Mapping Setup'>
          <div className='text'>
            Select your Mapping File
          </div>
          <input className="inputs" 
            type='file' name='file' 
            accept='.js' onChange={(e)=>this.onChangeSourceMap(e)}/>
          <div className='text'>
            Select your Sample Files
          </div>
          <input 
            className="inputs" 
            type='file' name='file' 
            accept='.csv' multiple onChange={(e)=>this.onChangeSourceFiles(e)}/>
          {displayProceed()}
        </Panel>
      </div>
    )
  }
}

export default Mapping
