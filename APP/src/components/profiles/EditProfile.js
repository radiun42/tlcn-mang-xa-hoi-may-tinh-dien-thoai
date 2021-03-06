import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMeProfile, updateProfile, changePassword, manageContact } from '../../actions/profile';
import dayjs from '../../utils/relativeDate';

const EditProfile = ({ profile: { profile, loading }, getMeProfile,
    updateProfile, changePassword, manageContact: manageContactAction }) => {

    const inputFileRef = useRef(null);

    const [formData, setFormData] = useState({
        fullname: '',
        dateOfBirth: dayjs().toDate(),
        city: '',
        age: '19-32',
        maritalStatus: 'Single',
        address: '',
        job: '',
        image: null,
        email: '',
        gender: '',
        country: '',
        username: ''
    });

    const [changePasswordData, setChangePasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        verifyPassword: ''
    });

    const [manageContact, setManageContact] = useState({
        phoneNumber: '',
        url: ''
    });

    const { fullname, dateOfBirth, city, age, maritalStatus,
        address, job, image, email, gender, country, username } = formData;

    const { currentPassword, newPassword, verifyPassword } = changePasswordData;

    const { phoneNumber, url } = manageContact;

    useEffect(() => {

        if (loading) {
            getMeProfile();
            return;
        }

        if (profile) {
            const { user, ...rest } = profile;

            setFormData({
                ...formData,
                ...user,
                ...rest,
                dateOfBirth: dayjs(rest.dateOfBirth).toDate()
            });

            setManageContact({
                ...manageContact,
                phoneNumber: rest.phoneNumber || '',
                url: rest.url || ''
            });
        }

    }, [getMeProfile, loading]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        const formData = new FormData();

        if (image) {
            formData.append('avatar', image);
        }

        formData.append('fullname', fullname);
        formData.append('dateOfBirth', dayjs(dateOfBirth).format('YYYY-MM-DD'));
        formData.append('city', city);
        formData.append('age', age);
        formData.append('maritalStatus', maritalStatus);
        formData.append('address', address);
        formData.append('job', job);
        formData.append('email', email);
        formData.append('gender', gender);
        formData.append('country', country);

        updateProfile(formData);
    };

    return !loading && profile && (
        <div id="content-page" className="content-page">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="iq-card">
                            <div className="iq-card-body p-0">
                                <div className="iq-edit-list">
                                    <ul className="iq-edit-profile d-flex nav nav-pills">
                                        <li className="col-md-3 p-0">
                                            <a className="nav-link active" data-toggle="pill" href="#personal-information">
                                                Personal Information
                                            </a>
                                        </li>
                                        <li className="col-md-3 p-0">
                                            <a className="nav-link" data-toggle="pill" href="#chang-pwd">
                                                Change Password
                                            </a>
                                        </li>
                                        <li className="col-md-3 p-0">
                                            <a className="nav-link" data-toggle="pill" href="#emailandsms">
                                                Email and SMS
                                            </a>
                                        </li>
                                        <li className="col-md-3 p-0">
                                            <a className="nav-link" data-toggle="pill" href="#manage-contact">
                                                Manage Contact
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="iq-edit-list-data">
                            <div className="tab-content">
                                <div className="tab-pane fade active show" id="personal-information" role="tabpanel">
                                    <div className="iq-card">
                                        <div className="iq-card-header d-flex justify-content-between">
                                            <div className="iq-header-title">
                                                <h4 className="card-title">Personal Information</h4>
                                            </div>
                                        </div>
                                        <div className="iq-card-body">
                                            <form onSubmit={e => onSubmit(e)}>
                                                <div className="form-group row align-items-center">
                                                    <div className="col-md-12 text-center">
                                                        <div className="profile-img-edit">
                                                            {image ? <img className="profile-pic" src={URL.createObjectURL(image)} alt="profile-pic" />
                                                                : <img className="profile-pic" src={profile.user.avatar} alt="profile-pic" />
                                                            }
                                                            <div className="p-image">
                                                                <i className="ri-pencil-line upload-button" onClick={() => {
                                                                    //Ref input elements to trigger click
                                                                    inputFileRef.current.click();
                                                                }} />
                                                                <input className="file-upload" type="file" accept="image/*"
                                                                    ref={inputFileRef}

                                                                    onChange={e => {
                                                                        e.preventDefault();
                                                                        const image = e.target.files[0];

                                                                        setFormData({
                                                                            ...formData,
                                                                            image
                                                                        })
                                                                    }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=" row align-items-center">
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="fname">Full Name:</label>
                                                        <input type="text" className="form-control" id="fname" placeholder="Bni"
                                                            name="fullname"
                                                            value={fullname}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="lname">Email:</label>
                                                        <input type="text" className="form-control" id="lname" placeholder="Jhon"
                                                            name="email"
                                                            value={email}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="uname">User Name:</label>
                                                        <input type="text" className="form-control" id="uname" placeholder="Bni@01"
                                                            readOnly={true}
                                                            value={username}
                                                        />
                                                    </div>
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="cname">City:</label>
                                                        <input type="text" className="form-control" id="cname" placeholder="Atlanta"
                                                            name="city"
                                                            value={city}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    <div className="form-group col-sm-6">
                                                        <label className="d-block">Gender:</label>
                                                        <div className="custom-control custom-radio custom-control-inline">
                                                            <input type="radio" id="customRadio6" name="customRadio1" className="custom-control-input"
                                                                checked={gender === 'm'}
                                                                name="gender"
                                                                value="m"
                                                                onChange={e => onChange(e)}
                                                            />
                                                            <label className="custom-control-label" htmlFor="customRadio6"> Male </label>
                                                        </div>
                                                        <div className="custom-control custom-radio custom-control-inline">
                                                            <input type="radio" id="customRadio7" name="customRadio1" className="custom-control-input"
                                                                checked={gender === 'f'}
                                                                name="gender"
                                                                value="f"
                                                                onChange={e => onChange(e)}
                                                            />
                                                            <label className="custom-control-label" htmlFor="customRadio7"> Female </label>
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="dob">Date Of Birth:</label>
                                                        <input className="form-control"
                                                            type="date"
                                                            id="dob"
                                                            name="dateOfBirth"
                                                            value={dayjs(dateOfBirth).format('YYYY-MM-DD')}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    <div className="form-group col-sm-6">
                                                        <label>Age:</label>
                                                        <select className="form-control" id="exampleFormControlSelect2"
                                                            name="age" defaultValue={age} onChange={e => onChange(e)}>
                                                            <option>12-18</option>
                                                            <option>19-32</option>
                                                            <option>33-45</option>
                                                            <option>46-62</option>
                                                            <option>63 &gt; </option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="cname">Job:</label>
                                                        <input type="text" className="form-control" id="cname" placeholder="Atlanta"
                                                            name="job"
                                                            value={job}
                                                            onChange={(e) => onChange(e)}
                                                        />
                                                    </div>
                                                    <div className="form-group col-sm-12">
                                                        <label>Address:</label>
                                                        <textarea className="form-control" name="address" rows={5} style={{ lineHeight: '22px' }}
                                                            name="address"
                                                            value={address}
                                                            onChange={(e) => onChange(e)} />
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-primary mr-2">Submit</button>
                                                <button type="reset" className="btn iq-bg-danger">Cancle</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="chang-pwd" role="tabpanel">
                                    <div className="iq-card">
                                        <div className="iq-card-header d-flex justify-content-between">
                                            <div className="iq-header-title">
                                                <h4 className="card-title">Change Password</h4>
                                            </div>
                                        </div>
                                        <div className="iq-card-body">
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                changePassword(changePasswordData);
                                            }}>
                                                <div className="form-group">
                                                    <label htmlFor="cpass">Current Password:</label>
                                                    <a href="#" className="float-right">Forgot Password</a>
                                                    <input type="Password" className="form-control" id="cpass"
                                                        name="currentPassword"
                                                        value={currentPassword}
                                                        onChange={e => setChangePasswordData({ ...changePasswordData, [e.target.name]: e.target.value })} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="npass">New Password:</label>
                                                    <input type="Password" className="form-control" id="npass"
                                                        name="newPassword"
                                                        value={newPassword}
                                                        onChange={e => setChangePasswordData({ ...changePasswordData, [e.target.name]: e.target.value })} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="vpass">Verify Password:</label>
                                                    <input type="Password" className="form-control" id="vpass" name="verifyPassword"
                                                        value={verifyPassword}
                                                        onChange={e => setChangePasswordData({ ...changePasswordData, [e.target.name]: e.target.value })} />
                                                </div>
                                                <button type="submit" className="btn btn-primary mr-2">Submit</button>
                                                <button type="reset" className="btn iq-bg-danger">Cancle</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="emailandsms" role="tabpanel">
                                    <div className="iq-card">
                                        <div className="iq-card-header d-flex justify-content-between">
                                            <div className="iq-header-title">
                                                <h4 className="card-title">Email and SMS</h4>
                                            </div>
                                        </div>
                                        <div className="iq-card-body">
                                            <form>
                                                <div className="form-group row align-items-center">
                                                    <label className="col-md-3" htmlFor="emailnotification">Email Notification:</label>
                                                    <div className="col-md-9 custom-control custom-switch">
                                                        <input type="checkbox" className="custom-control-input" id="emailnotification" defaultChecked />
                                                        <label className="custom-control-label" htmlFor="emailnotification" />
                                                    </div>
                                                </div>
                                                <div className="form-group row align-items-center">
                                                    <label className="col-md-3" htmlFor="smsnotification">SMS Notification:</label>
                                                    <div className="col-md-9 custom-control custom-switch">
                                                        <input type="checkbox" className="custom-control-input" id="smsnotification" defaultChecked />
                                                        <label className="custom-control-label" htmlFor="smsnotification" />
                                                    </div>
                                                </div>
                                                <div className="form-group row align-items-center">
                                                    <label className="col-md-3" htmlFor="npass">When To Email</label>
                                                    <div className="col-md-9">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="email01" />
                                                            <label className="custom-control-label" htmlFor="email01">You have new notifications.</label>
                                                        </div>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="email02" />
                                                            <label className="custom-control-label" htmlFor="email02">You're sent a direct message</label>
                                                        </div>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="email03" defaultChecked />
                                                            <label className="custom-control-label" htmlFor="email03">Someone adds you as a connection</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group row align-items-center">
                                                    <label className="col-md-3" htmlFor="npass">When To Escalate Emails</label>
                                                    <div className="col-md-9">
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="email04" />
                                                            <label className="custom-control-label" htmlFor="email04"> Upon new order.</label>
                                                        </div>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="email05" />
                                                            <label className="custom-control-label" htmlFor="email05"> New membership approval</label>
                                                        </div>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="email06" defaultChecked />
                                                            <label className="custom-control-label" htmlFor="email06"> Member registration</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-primary mr-2">Submit</button>
                                                <button type="reset" className="btn iq-bg-danger">Cancle</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="manage-contact" role="tabpanel">
                                    <div className="iq-card">
                                        <div className="iq-card-header d-flex justify-content-between">
                                            <div className="iq-header-title">
                                                <h4 className="card-title">Manage Contact</h4>
                                            </div>
                                        </div>
                                        <div className="iq-card-body">
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                manageContactAction(manageContact);
                                            }}>
                                                <div className="form-group">
                                                    <label htmlFor="cno">Contact Number:</label>
                                                    <input type="text" className="form-control" id="cno"
                                                        placeholder="E.x. 092 123 3212"
                                                        name="phoneNumber"
                                                        value={phoneNumber}
                                                        onChange={e => setManageContact({ ...manageContact, [e.target.name]: e.target.value })} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email:</label>
                                                    <input type="text" className="form-control" id="email" placeholder="example@gmail.com"
                                                        name="email"
                                                        value={email}
                                                        onChange={e => formData({ ...formData, [e.target.name]: e.target.value })} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="url">Url:</label>
                                                    <input type="text" className="form-control" id="url" placeholder="E.x. https://user.profesional.com"
                                                        name="url"
                                                        value={url}
                                                        onChange={e => setManageContact({ ...manageContact, [e.target.name]: e.target.value })} />
                                                </div>
                                                <button type="submit" className="btn btn-primary mr-2">Submit</button>
                                                <button type="reset" className="btn iq-bg-danger">Cancle</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

EditProfile.propTypes = {
    getMeProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    manageContact: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getMeProfile, updateProfile, changePassword, manageContact })(EditProfile);