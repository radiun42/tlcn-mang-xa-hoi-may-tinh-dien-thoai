import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import urlAPI from '../../utils/urlAPI';

const Login = ({ auth: { isAuthenticated, user }, login, history }) => {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const { username, password } = formData;

    if (isAuthenticated && user) {
        history.goBack();
    }

    /*
        Another solution: When Login is successfully, check isAuthenticated true
        Redirect to home through Redirect (react-router-dom).
        if (isAuthenticated) {
            return <Redirect to="/" />
        }
        Current solution: When Login is successfully, check user is loadded then
        Go back previous page.
    */

    const onSubmit = async (e) => {
        e.preventDefault();
        login(username, password);
    }

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <section className="sign-in-page">
            <div id="container-inside">
                <div id="circle-small" />
                <div id="circle-medium" />
                <div id="circle-large" />
                <div id="circle-xlarge" />
                <div id="circle-xxlarge" />
            </div>
            <div className="container p-0">
                <div className="row no-gutters">
                    <div className="col-md-6 text-center pt-5">
                        <div className="sign-in-detail text-white">
                            <Link className="sign-in-logo mb-5" to="/"><img src="images/logo-full.png" className="img-fluid" alt="logo" /></Link>
                       </div>
                    </div>
                    <div className="col-md-6 bg-white pt-5">
                        <div className="sign-in-from">
                            <h1 className="mb-0">Sign in</h1>
                            <p>Enter your username and password to access more feature.</p>
                            <form className="mt-4" onSubmit={e => onSubmit(e)}>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Username</label>
                                    <input type="text" className="form-control mb-0" id="exampleInputEmail1" placeholder="Username"
                                        tabIndex="1"
                                        autoFocus={true}
                                        name="username"
                                        value={username}
                                        onChange={(e) => onChange(e)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password</label>
                                    <Link to="/forgot-password" className="float-right">Forgot password?</Link>
                                    <input type="password" className="form-control mb-0" id="exampleInputPassword1" placeholder="Password"
                                        tabIndex="2"
                                        name="password"
                                        value={password}
                                        onChange={(e) => onChange(e)} />
                                </div>
                                <div className="d-inline-block w-100">
                                    <div className="custom-control custom-checkbox d-inline-block mt-2 pt-1">
                                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                        <label className="custom-control-label" htmlFor="customCheck1">Remember Me</label>
                                    </div>
                                    <button type="submit" className="btn btn-primary float-right">Sign in</button>
                                </div>
                                <div className="sign-info">
                                    <span className="dark-color d-inline-block line-height-2">Don't have an account? <Link to="/register">Sign up</Link></span>
                                    <ul className="iq-social-media">
                                        <li><a href={`${urlAPI}/auth/facebook`} role="button"><i className="ri-facebook-box-line" /></a></li>
                                        <li><a href={`${urlAPI}/auth/google`}><i className="ri-google-line" /></a></li>
                                    </ul>
                                </div>
                               </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

Login.propTypes = {
    login: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { login })(withRouter(Login));