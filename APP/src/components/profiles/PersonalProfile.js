import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfileById } from '../../actions/profile';
import FriendStatus from '../shared/friend/FriendStatus';

const PersonalProfile = ({ auth: { user, isAuthenticated },
    profile: { profile, loading }, getProfileById, match
}) => {

    useEffect(() => {
        getProfileById(match.params.id);
    }, [getProfileById, isAuthenticated, match]);

    return !loading && profile && (
        <div className="iq-card">
            <div className="iq-card-body profile-page p-0">
                <div className="profile-header profile-info">
                    <div className="cover-container">
                        <img src="/images/page-img/profile-bg1.jpg" alt="profile-bg" className="rounded img-fluid" />
                        <ul className="header-nav d-flex flex-wrap justify-end p-0 m-0">
                            {user && isAuthenticated && user._id === profile.user._id &&
                                <li style={{ cursor: "pointer", zIndex: "2" }}><Link to={`/profile/edit`}><i className="ri-pencil-line" /></Link></li>}
                            {user && isAuthenticated && user._id !== profile.user._id && (
                                <li style={{ cursor: "pointer", zIndex: "2" }}>
                                    <FriendStatus match={match} />
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="user-detail text-center mb-3">
                        <div className="profile-img">
                            <img src={profile.user.avatar} alt="profile-img" className="avatar-130 img-fluid" />
                        </div>
                        <div className="profile-detail">
                            <h3>{profile.user.fullname}</h3>
                        </div>
                    </div>
                    <div className="profile-info p-4 d-flex align-items-center justify-content-between position-relative">
                        <div className="social-links">
                            <ul className="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
                            </ul>
                        </div>
                        <div className="social-info mt-4">
                            <ul className="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getProfileById })(PersonalProfile);