import React, { Component } from 'react';
import './HomePage.css';
//import { connect } from 'react-redux';


class HomePage extends Component {
  render(){
    return(
      <div className="home">
        <div className="header">
          MARS
          <div className="subtitle">
            Middleware for Assisting the Registration of Samples
          </div>
        </div>
      </div>
    )
  }
}
export default HomePage
