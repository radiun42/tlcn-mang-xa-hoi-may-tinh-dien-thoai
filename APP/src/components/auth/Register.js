import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import urlAPI from '../../utils/urlAPI';
import { register } from '../../actions/auth';
import { setAlert } from '../../actions/alert';

const Register = ({ auth: { isAuthenticated }, register, setAlert }) => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        password2: '',
        fullname: '',
        email: ''
    })

    const { username, password, password2, fullname, email } = formData;

    if (isAuthenticated) {
        return <Redirect to='/' />
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        register({ username, password, fullname, email });
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
                            <h1 className="mb-0">Sign Up</h1>
                            <p>Join Social Network or sign in</p>
                            <form className="mt-4" onSubmit={e => onSubmit(e)}>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Your Full Name</label>
                                    <input type="text" className="form-control mb-0" id="exampleInputEmail1" placeholder="Your Full Name"
                                        name="fullname"
                                        value={fullname}
                                        required={true}
                                        onChange={(e) => onChange(e)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail2">Email address</label>
                                    <input type="email" className="form-control mb-0" id="exampleInputEmail2" placeholder="Enter Email"
                                        name="email"
                                        value={email}
                                        required={true}
                                        onChange={(e) => onChange(e)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail2">Username</label>
                                    <input type="text" className="form-control mb-0" id="exampleInputEmail2" placeholder="Username"
                                        name="username"
                                        value={username}
                                        required={true}
                                        onChange={(e) => onChange(e)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password</label>
                                    <input type="password" className="form-control mb-0" id="exampleInputPassword1" placeholder="Password"
                                        name="password"
                                        value={password}
                                        required={true}
                                        onChange={(e) => onChange(e)} />
                                </div>
                                <div className="d-inline-block w-100">
                                    <div className="custom-control custom-checkbox d-inline-block mt-2 pt-1">
                                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                        <label className="custom-control-label" htmlFor="customCheck1">I accept <a href="sign-up.html#">Terms and Conditions</a></label>
                                    </div>
                                    <button type="submit" className="btn btn-primary float-right">Sign Up</button>
                                </div>
                                <div className="sign-info">
                                    <span className="dark-color d-inline-block line-height-2">Already Have Account ? <Link to="/login">Log In</Link></span>
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

Register.propTypes = {
    register: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { register, setAlert })(Register);