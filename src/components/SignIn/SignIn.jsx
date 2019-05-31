import React, { Component } from 'react';

import { Form ,Field, reduxForm } from 'redux-form/immutable';
import { signInAction } from '../../actions/auth';
import { connect } from 'react-redux'
import './SignIn.css'

const renderField = ({ input, label, type, meta: { touched, error } }) => (
<div>
  <label>{label}</label>
  <div>
    <input {...input} style={{color: 'black'}}placeholder={label} type={type}/>
    {touched && error && <span>{error}</span>}
  </div>
</div>)

class SignIn extends Component {

  //Send login info to redux actions
  submit = (values) => {
    console.log(values)
    this.props.signInAction(values, this.props.history);
  }

  errorMessage() {
  if (this.props.errorMessage) {
    return (
      <div className="info-red">
        {this.props.errorMessage}
      </div>
      );
    }
  }

  renderPassword () {
  return (
    <div >
      <input/>
      <input/>
    </div>
  );
}


  render() {
    const { handleSubmit } = this.props
    return (
      <div className="form">
        <div className="container">
          <h2>GeoPass Login</h2>
          <Form onSubmit={ handleSubmit(this.submit)}>
            <Field name="username"
                   component={renderField}
                   type="text"
                   placeholder="username"
            />
            <Field name="password"
                   component={renderField}
                   type="password"
                   placeholder="password"
            />
              <button
                type="submit"
                className="btn btn-primary"
              >
                Login
              </button>
          </Form>
            {this.errorMessage()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

const reduxFormSignIn = reduxForm({
  form: 'signin'
})(SignIn);

export default connect(mapStateToProps, {signInAction})(reduxFormSignIn);
