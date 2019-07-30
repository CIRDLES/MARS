import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Upload.css'

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MUIDataTable from 'mui-datatables';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { withStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',

        overflowX: 'auto'
      },
    table: {
        minWidth: '100%',
        height: '2rem'
    },
    column: {
        whiteSpace: "normal",
        wordWrap: "break-word",
        width: "25%"
    } 
})
   
class Upload extends Component{
    constructor(props){
        super(props);

        this.state={
            rowData: [],
            columnDefs: [],
            originalKeys: [],
            uploadSamples: [],
           
        }

        this.handleOnUpload = this.handleOnUpload.bind(this)
    }
    

    componentWillReceiveProps(nextProps){
        if(nextProps.uploadSamples !== this.props.uploadSamples | nextProps.loading !== this.props.loading){

            var uploadSamples =nextProps.uploadSamples
            var sesarKeys = new Set()
            var rowData = []
            var columnDefs = []
            var originalKeys = []

            this.setState({uploadSamples})

            for (let i = 0; i < nextProps.uploadSamples.length; i++){
                for (let j=0; j < nextProps.uploadSamples[i].length; j++){

                    let sampleData = nextProps.uploadSamples[i]
                    let dataRow = nextProps.uploadSamples[i][j]

                    if (dataRow.key !== undefined){
                        sesarKeys.add(dataRow.key)
                    }

                    originalKeys =  [...new Set(sampleData.map(data =>
                        {
                            return data.originalKey
                        }
                    ))]
                }
               
            }
            sesarKeys = [...sesarKeys]
            this.setState({originalKeys})

            //get rowData & return a value based on a key
            for (let i = 0; i < nextProps.uploadSamples.length; i++){
                var keyValue = {}

                for(let j=0; j < sesarKeys.length; j++){
                    var keyData = sesarKeys[j]
                    var data = nextProps.uploadSamples[i].filter(x => 
                        {
                                return x.key === sesarKeys[j]
                        }).map(x => 
                            {
                                    return x.value
                            })
                    keyValue[keyData] = data[0] 
                }

                rowData = [...rowData, keyValue]
                this.setState({rowData})
            }

            //create columnDefs based on the keys
            for (let i = 0; i < sesarKeys.length; i++){
                columnDefs.push(sesarKeys[i])  
            }
            this.setState({columnDefs})
       
            
        }
    }

    handleOnUpload(selectedRows){
        //create an array of the indices of samples that were selected to be uploaded
        let selectedSamples = []
        for ( let i = 0; i < selectedRows.data.length; i++){
            selectedSamples = [...selectedSamples, selectedRows.data[i].index]
        }

        if (selectedSamples.length > 0){
            this.props.onUpload(this.props.mapFile, this.props.uploadSamples, this.props.user, selectedSamples)
        }
    }
   
     
   render(){
    const {classes} = this.props;
    var rows = this.state.uploadSamples

    let theme = createMuiTheme({
        overrides: {
            MUIDataTableSelectCell: {
                root: {
                    backgroundColor: '#FFFF'
                }
            }
        }
    });
    
    const options = {
        filter: true,
        filterType: 'dropdown',
        responsive: 'scroll',
        expandableRows: true,
        expandableRowsOnClick: true,
        //allow rows with no igsn to be selected
        isRowSelectable: (dataIndex) => {
            return this.state.rowData[dataIndex].igsn === ""
        },
        customToolbarSelect: selectedRows => (
            <div>
                <Button variant="contained" color="primary" onClick={() => this.handleOnUpload(selectedRows)}>Upload</Button>
            </div>
            
        ),
        renderExpandableRow: (rowData, rowMeta) => {
            const colSpan = rowData.length
            const index = rowMeta.rowIndex
            return (
                <TableRow>
                    <TableCell colSpan={colSpan}>
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow >
                                            <TableCell>Original Field</TableCell>
                                            <TableCell align="left">Original Value</TableCell>
                                            <TableCell align="left">SESAR Field</TableCell>
                                            <TableCell align="left">SEASAR Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows[index].map(row => (
                                        <TableRow key={row.originalKey}>
                                            <TableCell className={classes.column}>{row.originalKey}</TableCell>
                                            <TableCell className={classes.column} align="left">{row.originalValue}</TableCell>
                                            <TableCell className={classes.column} align="left">{row.key}</TableCell>
                                            <TableCell className={classes.column} align="left">{row.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody> 
                            </Table>
                        </Paper>
                    </TableCell>
                </TableRow>
            );
        }
    }


    if (this.props.loading === false){
        return(
        <div style={{ width: "100%", height: "100%" }}>
            <div className="container">
                <div id="left"></div>

                <div className ="center">
                    <MuiThemeProvider theme={theme}>
                        <MUIDataTable
                            title={"Sample Data"}
                            data={this.state.rowData}
                            columns={this.state.columnDefs}
                            options={options}/>
                    </MuiThemeProvider>   
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
Upload.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Upload)