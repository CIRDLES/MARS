import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/*This component redirects the user to signIn
  if they are not authenticated*/
export default function (ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      if (!this.props.authenticated) {
        this.props.history.push('/signin');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.authenticated) {
        this.props.history.push('/signin');
      }
    }

    PropTypes = {
      router: PropTypes.object,
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}
