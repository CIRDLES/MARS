import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom'
import HomePage from './components/Homepage/HomePage';
import requireAuth from './components/higherOrderComponents/require_auth';
import noRequireAuth from './components/higherOrderComponents/no_require_auth';
import SignIn from './components/SignIn/SignIn';
import SignOut from './components/SignOut/SignOut';


class Header extends Component {
  navbarLinks() {

    //Return different links depending on the authentication status
    if (this.props.authenticated) {
      return(
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link" to="/signout">Sign Out</Link>
          </li>
        </ul>
 
      );
    }
    return (
      <ul className="nav">
        <li className="nav-item">
          <Link className="nav-link" to="/signin">Sign In</Link> 
        </li>
      </ul>
    );
  }

  render() {
    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link className="navbar-brand" to="/">MarsX</Link>
                    <div>
                        {this.navbarLinks()}
                    </div>
                </nav>
            </header>
            <main>
                <Route exact path="/" component={HomePage} />
                <Route path="/signin" component={noRequireAuth(SignIn)} />
                <Route path="/signout" component={requireAuth(SignOut)} />
            </main>
        </div>
     
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(Header);
