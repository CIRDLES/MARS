import React, { Component } from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './Upload.css'

class Upload extends Component{
    constructor(props){
        super(props);
        this.state={
            rowData: [],
            columnDefs: [],
            isRowSelectable: function(rowNode) {
                return rowNode.data ? 
                rowNode.data.igsn === "" && 
                rowNode.data.latitude !== "" && 
                rowNode.data.longitude !== "" : false;
            }
        }
     
        this.handleOnUpload = this.handleOnUpload.bind(this)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.uploadSamples !== this.props.uploadSamples | nextProps.loading !== this.props.loading){
            var keys = []
            var rowData = []
            var columnDefs = []

            //find all keys, if a mapped key doesn't exist used the original key
            for (let i = 0; i < nextProps.uploadSamples.length; i++){
                for (let j=0; j < nextProps.uploadSamples[i].length; j++){
                   let sampleData = nextProps.uploadSamples[i]
                   keys = [...new Set(sampleData.map(data => 
                    {
                        if (data.key !== undefined){
                            return data.key
                        }else{
                            return data.originalKey
                        }
                    }
                    ))]
                }
            }

            //get rowData for ag-grid component
            for (let i = 0; i < nextProps.uploadSamples.length; i++){
                var value = {}
                for(let j=0; j < keys.length; j++){
                    var keyVal = keys[j]

                    /*return a value based on a key, 
                        if a mapped key doesnt exist use the original key and original value*/
                    var data = nextProps.uploadSamples[i].filter(x => 
                        {
                            if(x.key !== undefined){
                                return x.key === keys[j]
                            }else{
                                return x.originalKey === keys[j]
                            }
                        }).map(x => 
                            {
                                if(x.value !== undefined){
                                    return x.value
                                }else{
                                    return x.originalValue
                                }
                            })
                    value[keyVal] = data[0]
                    
                }
               
                rowData = [...rowData, value]
                this.setState({rowData})
            }

            //create columnDefs based on the keys
            for (let i = 0; i < keys.length; i++){
                if (i === 0) {
                    columnDefs.push({
                        headerName: keys[i], field: keys[i], checkboxSelection: true,  headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
                    })
                }else {
                    columnDefs.push({
                        headerName: keys[i], field: keys[i]
                    })
                }
                
            }
            this.setState({columnDefs})
       

        }
    }

    handleOnUpload(e){
        e.preventDefault()
        let selectedSamples = this.gridApi.getSelectedNodes()
        if (selectedSamples.length > 0){
            this.props.onUpload(this.props.mapFile, this.props.uploadSamples, this.props.user, selectedSamples)
        }
    }

   render(){

    if (this.props.loading === false){

        return(
        <div style={{ width: "100%", height: "100%" }}>
            <div className="container">
                <div id="left"></div>

                <div className ="center">
                    <div className="ag-theme-balham"
                        style={{
                        height: '600px',
                        width: '90%' ,
                        margin: 'auto'
                        }}>
                        <AgGridReact
                            onGridReady= {params =>  this.gridApi = params.api}
                            rowSelection="multiple"
                            sortable={true}
                            filter={true}
                            columnDefs={this.state.columnDefs}
                            isRowSelectable={this.state.isRowSelectable}
                            rowData={this.state.rowData}>
                            <AgGridColumn headerName="Sample"></AgGridColumn>
                        </AgGridReact>
                        
                        <div className="buttonDiv">
                            <button type= "button" 
                            className="btn btn-primary uploadButton" 
                            onClick={this.handleOnUpload}>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>

                <div id="right"></div>
            </div>
        </div>
        )
    }else{
        return(
            <div className="outerDiv">
                <div className="d-flex justify-content-center">
                     <div className="spinner-grow text-primary" 
                     style={{width: '6rem', height: '6rem'}} 
                     role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }
        
    }
}

export default Upload