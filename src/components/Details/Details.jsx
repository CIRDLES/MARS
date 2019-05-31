import React, { Component } from 'react';
import axios from 'axios';
import './Details.css'
import { connect } from 'react-redux';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Column deffinitions for ag-grid
      columnDefs: [
        {headerName: "IGSN", field: "IGSN" ,checkboxSelection: true},
        {headerName: "Sample Name", field: "sampleName"},
        {headerName: "Latitude", field: "latitude"},
        {headerName: "Longitude", field: "longitude"},
        {headerName: "Elevation", field: "elevation"},
      ],
      rowData: [{}],
      loading: true,
      page_no: 1,
      limit: 20,
      sortingFlag: 0,
      sortSampleNamesFlag: false
    }

    this.handleClickNext = this.handleClickNext.bind(this)
    this.handleClickPrev = this.handleClickPrev.bind(this)
    //TODO: add change limit
    //this.changeLimit = this.changeLimit.bind(this)*/
    this.sendRequest = this.sendRequest.bind(this)
    this.handleOpenProfile = this.handleOpenProfile.bind(this)
  }

  componentDidMount() {
    this.sendRequest(0)
  }

  handleClickNext(e){
    e.preventDefault()
    this.sendRequest(1)
  };

  handleClickPrev(e){
    e.preventDefault()
    if(this.state.page_no !== 1) {
      this.sendRequest(-1)
    }
  };
  handleOpenProfile(e){
    const length = this.gridApi.getSelectedNodes().length
    for (var i = 0; i < length; i++){
      let igsn = this.gridApi.getSelectedNodes()[i].data.IGSN
      window.open(`https://sesardev.geosamples.org/sample/igsn/${igsn}`)
    }
  }

  sendRequest(num){

    //Reset state everytime new information needs to be put into state
    this.setState({ rowData: [], loading: true, page_no: (this.state.page_no + num)})

    //API Request: Get IGSNs
    axios
    .get(`https://sesardev.geosamples.org/samples/user_code/${this.props.usercode}`,{
      params: {
        limit: this.state.limit,
        page_no: this.state.page_no + num
      }
    })
    .then ( response => {
      const length = response.data.igsn_list.length
      response.data.igsn_list.map((igsn,i) => {

        //API Request: Get other information for each IGSN
        axios
        .get(`https://sesardev.geosamples.org/webservices/display.php?igsn=${igsn}`)
        .then( response => {

          //Grabbing each piece of information needed and updating state as needed.
          const sampleName = response.data.sample.name
          const latitudes = response.data.sample.latitude
          const longitudes = response.data.sample.longitude
          const elevations = response.data.sample.elevation
          this.setState({rowData: [...this.state.rowData,
            {IGSN: igsn,
              sampleName: sampleName,
              latitude: latitudes,
              longitude: longitudes,
              elevation: elevations }]})

          if(this.state.rowData.length === length){
            //Allow the information to be rendered.
            this.setState({loading: false})
          }
        })
      });
    })
    //Throw an error if the GET request don't come through
    .catch(error => {
      console.log(error)
        if (error.response.status === 404){
        console.log('error 404')
        var pageBeforeError = this.state.page_no -1
        this.setState({page_no: (pageBeforeError)})
        this.sendRequest(0)
      }
    });
  }

  render() {
    if(this.state.loading === true) {
      return (
        <div className="outerDiv">
          <div className="d-flex justify-content-center">
            <div className="spinner-grow text-primary" style={{width: '6rem', height: '6rem'}} role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
       
      )
    } else {
      console.log(this.state)
      return (
        <div>
          <div
            className="ag-theme-balham"
            style={{
              height: '600px',
              width: '90%' ,
              margin: 'auto'
            }}
          >
            <button 
              type="button" 
              className="btn btn-primary btn-lg" 
              onClick={this.handleOpenProfile}>
              Open Sample Page
            </button>


            <AgGridReact
              onGridReady={ params => this.gridApi = params.api }
              rowSelection="single"
              enableSorting={true}
              enableFilter={true}
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}>
            </AgGridReact>
            <div className="btn-group" role="group" aria-label="details group">
              <button type="button" className="btn btn-primary" onClick={this.handleClickPrev}>Previous</button>
              <button type="button" className="btn btn-primary" onClick={this.handleClickNext}>Next</button>
            </div>

            <div>
              Page {this.state.page_no}
            </div>

          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state){
  return{
    usercode: state.auth.usercode
  };
}

const Details = connect(mapStateToProps)(Detail)
export default Details;
