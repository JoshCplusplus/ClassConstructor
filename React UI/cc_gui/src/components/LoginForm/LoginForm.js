import React from "react";
import './LoginForm.css';
import './LoginFormConstants';
import {
  withRouter
} from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import PropTypes from 'prop-types';

class LoginForm extends React.Component {


    /*
     * On login success send the information to the back end
     */
    googleLoginSuccess = (response) => {

        //Send the token to the backend
        fetch("/auth/client-login", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(response)
        })
        .then(response => {
            this.props.handleLoginSuccess();
        })
        .catch(err => console.log(err))
    }

    googleLoginFailure = (response) => {

    }

    componentDidMount() {
    }


    render() {
        return (
            <div className="login-form-filler">
                <div className="login-form-container">
                    <img src={require("../imgCCLogo.png")} className = "logo" alt=""/>
                    <div className="google-button-holder">
                        <GoogleLogin
                            className="google-button"
                            clientId="39000677312-ndi9av8u0n0i7kp48ochqe5mp23rrmbp.apps.googleusercontent.com"
                            buttonText="Login"
                            onSuccess={this.googleLoginSuccess}
                            onFailure={this.googleLoginFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>

                <footer className="footer">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-4 panel-pad-10">
                                <p>  </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}


LoginForm.propTypes = {
    userData: PropTypes.object.isRequired,
    handleLoginSuccess: PropTypes.func.isRequired
}

export default withRouter(LoginForm);
