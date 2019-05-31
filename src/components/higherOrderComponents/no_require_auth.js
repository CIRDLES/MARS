import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/*This component redirects the user to Upload
  if they are authenticated*/
export default function (ComposedComponent) {
  class NotAuthentication extends Component {
    componentWillMount() {
      if (this.props.authenticated) {
        this.props.history.push('/upload');
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps.authenticated) {
        this.props.history.push('/upload');
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

  return connect(mapStateToProps)(NotAuthentication);
}
