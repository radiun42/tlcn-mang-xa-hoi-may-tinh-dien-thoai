import React, { lazy, Suspense, useState, useRef } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import dayjs from '../../../../utils/relativeDate';

import { sharePostTimeLine } from './utils/sharePost';
import Status from '../previews/Status';
import DisplayPrivacy from '../../toolbar/DisplayPrivacy';
import Toolbar from '../../toolbar/ToolBar';

const BubbleEditor = lazy(() => import('../../editor/BubbleEditor'));
const ImagePost = lazy(() => import('./ImagePost/ImagePost'));
const HashTag = lazy(() => import('../hash-tag/HashTag'));
const Review = lazy(() => import('../previews/Review'));

Modal.setAppElement('#root');

const customStyles = {
    overlay: {
        position: 'fixed',
        zIndex: 999999,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        border: 'none',
        background: 'white',
        right: 'auto',
        inset: '0px',
        width: '50rem',
        maxWidth: 'calc(100vw - 2rem)',
        maxHeight: 'calc(100vh - 2rem)',
        boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.25)',
        overflowY: 'auto',
        position: 'relative',
        padding: '0px'
    }
};

const ShareModal = ({ auth: { user, isAuthenticated },
    post: { post }, isMobileScreen
}) => {

    const [modalIsOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        text: '',
        imageUrls: []
    });

    // Privacy post (public, friends, private)
    const privacyRef = useRef(1);

    const { text, imageUrls } = formData;

    const closeModal = () => {
        setIsOpen(false);

        setFormData({
            text: '',
            imageUrls: []
        });
    }

    const openModal = () => {

        if (post) {
            setFormData({
                ...formData,
                text: '',
                imageUrls: post.imageUrls || []
            });
        }

        setIsOpen(true);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const share = post.share;

        const postId = share && share.postId && share.postId.user ? share.postId._id : post._id;

        sharePostTimeLine(postId, {
            text,
            privacy: privacyRef.current
        }).then(data => console.log(data));

        closeModal();
    }

    const previewPost = () => {
        const share = post.share;

        if (share && share.postId && share.postId.user) {
            const postShared = share.postId;

            // Return if user forward share.
            return (
                <div className="container border-left border-right">
                    <Suspense fallback={<div>Loading...</div>}>
                        <div className="user-post w-75 m-auto">
                            <ImagePost imageUrls={postShared.imageUrls} />
                        </div>
                        <hr />
                        <div className="user-post-data container mt-2">
                            <div className="d-flex flex-wrap">
                                <div className="media-support-user-img mr-3">
                                    <img className="avatar-60 rounded-circle" src={postShared.avatar} alt="" />
                                </div>
                                <div className="media-support-info mt-2">
                                    <h5 className="mb-0 d-inline-block"><Link to={`/profile/${postShared.user}`}>{postShared.name}&nbsp;</Link></h5>
                                    <Status type={postShared.type} tags={postShared.tags} share={postShared.share} />
                                    <div className="mb-0">
                                        <span className=" text-primary">{dayjs(postShared.createdAt).fromNow()}</span>
                                        <span> · </span>
                                        <DisplayPrivacy privacy={postShared.privacy} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="standalone-container">
                            {postShared.type && postShared.type.review ?
                                <Review text={postShared.text} Component={BubbleEditor}
                                    reviewId={postShared.type.review} /> : (
                                    <div className="mt-3">
                                        <BubbleEditor readOnly={true} text={postShared.text} />
                                    </div>
                                )}
                        </div>
                        {postShared.hashtag && <HashTag hashtag={postShared.hashtag} />}
                    </Suspense>
                    <hr />
                </div>
            );
        }

        return (
            <div className="container border-left border-right">
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="user-post w-75 m-auto">
                        <ImagePost imageUrls={imageUrls} />
                    </div>
                    <hr />
                    <div className="user-post-data container mt-2">
                        <div className="d-flex flex-wrap">
                            <div className="media-support-user-img mr-3">
                                <img className="avatar-60 rounded-circle" src={post.avatar} alt="" />
                            </div>
                            <div className="media-support-info mt-2">
                                <h5 className="mb-0 d-inline-block"><Link to={`/profile/${post.user}`}>{post.name}&nbsp;</Link></h5>
                                <Status type={post.type} tags={post.tags} share={post.share} />
                                <div className="mb-0">
                                    <span className="text-primary">{dayjs(post.createdAt).fromNow()}</span>
                                    <span> · </span>
                                    <DisplayPrivacy privacy={post.privacy} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="standalone-container">
                        {post.type && post.type.review ?
                            <Review text={post.text} Component={BubbleEditor}
                                reviewId={post.type.review} /> : (
                                <div className="mt-3">
                                    <BubbleEditor readOnly={true} text={post.text} />
                                </div>
                            )}
                    </div>
                    {post.hashtag && <HashTag hashtag={post.hashtag} />}
                </Suspense>
                <hr />
            </div>
        );
    };

    return (
        <>
            <a className="pointer" onClick={() => openModal()}><i className="ri-share-line" />
                <span className={`ml-1 ${isMobileScreen ? 'd-none' : ''}`} id="share-post-line">Share this post</span>
            </a>
            <Modal style={customStyles}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}>
                <div className="modal-lg m-0" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="post-modalLabel">Share this post</h5>
                            <button onClick={() => closeModal()} type="button" className="btn btn-secondary" data-dismiss="modal"><i className="ri-close-fill" /></button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex align-items-center">
                                <div className="user-img">
                                    {user && user.avatar && <img src={user.avatar} alt="userimg" className="avatar-60 rounded-circle img-fluid" />}
                                </div>
                                <form className="post-text ml-3 w-100" >
                                    <div className="standalone-container">
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <BubbleEditor text={text} setText={(value) => setFormData({ ...formData, text: value })}
                                                placeholder="Write something here..." />
                                        </Suspense>
                                    </div>
                                </form>
                            </div>
                            <hr />
                            {post && previewPost()}
                            <div className="other-option">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        {/* <div className="user-img mr-3">
                                            {user && user.avatar && <img src={user.avatar} alt="userimg" className="avatar-60 rounded-circle img-fluid" />}
                                        </div> */}
                                        <h6>Your Story</h6>
                                    </div>
                                    <Toolbar privacy={privacyRef} />
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary d-block w-100 mt-3"
                                disabled={!isAuthenticated}
                                onClick={(e) => onSubmit(e)}>Share</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    post: state.post
});

export default connect(mapStateToProps)(ShareModal);