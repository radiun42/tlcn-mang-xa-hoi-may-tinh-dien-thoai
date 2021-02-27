import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';

import { likePost, unlikePost } from '../../../../actions/post';
import { useHistory } from 'react-router-dom';

const Bar = ({ createdAt, postId, likePost, unlikePost }) => {

    const [isLiked, setIsLiked] = useState(false);
    const [emoji, setEmoji] = useState(0);

    const { auth: { user, isAuthenticated }, post } = useSelector((state) => ({
        auth: state.auth,
        post: state.post.post
    }));

    const history = useHistory();

    const { likes, lengthOfComments } = post || {};

    useEffect(() => {
        if (isAuthenticated && likes) {
            const userLiked = likes.find(like => like.user === user._id);

            if (userLiked) {
                setIsLiked(true);
                setEmoji(userLiked.emoji);
            }
        }
        else {
            setIsLiked(false);
        }
    }, [isAuthenticated, likes]);

    const onLikeHandler = (nextEmoji) => {
        if (!isAuthenticated) {
            history.push('/login');
        } else if (isLiked && emoji === nextEmoji) {
            unlikePost(postId);
            setEmoji(0);
        }
        else {
            likePost(postId, nextEmoji);
        }
        setIsLiked(!isLiked);
    };

    const emojiComponent = (number = 0) => (
        <img src={`/images/icon/0${number + 1}.png`} className="img-fluid" alt=""
            style={{ width: '2opx' }}
            onClick={() => onLikeHandler(number)} />
    );

    return post && (
        <div className="blog-meta d-flex align-items-center mb-3">
            <div className="date mr-4"><i className="ri-calendar-2-fill text-primary pr-2" />{createdAt}</div>
            <div className="like-data mr-4">
                <div className="dropdown">
                    <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                        {emojiComponent(emoji)}&nbsp;
                        <span className={`dropdown-toggle ${isLiked && "text-primary"}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                            {likes && likes.length || 0}
                        </span>
                    </span>
                    <div className="dropdown-menu">
                        <a className="ml-2 mr-2" data-toggle="tooltip" data-placement="top" data-original-title="Like"
                            onClick={() => onLikeHandler(0)} > <img src="/images/icon/01.png" className="img-fluid" alt="" /></a>
                        <a className="mr-2" data-toggle="tooltip" data-placement="top" data-original-title="Love"><img src="/images/icon/02.png" className="img-fluid" alt=""
                            onClick={() => onLikeHandler(1)} /></a>
                        <a className="mr-2" data-toggle="tooltip" data-placement="top" data-original-title="Happy"><img src="/images/icon/03.png" className="img-fluid" alt=""
                            onClick={() => onLikeHandler(2)} /></a>
                        <a className="mr-2" data-toggle="tooltip" data-placement="top" data-original-title="HaHa"><img src="/images/icon/04.png" className="img-fluid" alt=""
                            onClick={() => onLikeHandler(3)} /></a>
                        <a className="mr-2" data-toggle="tooltip" data-placement="top" data-original-title="Think"><img src="/images/icon/05.png" className="img-fluid" alt=""
                            onClick={() => onLikeHandler(4)} /></a>
                        <a className="mr-2" data-toggle="tooltip" data-placement="top" data-original-title="Sade"><img src="/images/icon/06.png" className="img-fluid" alt=""
                            onClick={() => onLikeHandler(5)} /></a>
                        <a className="mr-2" data-toggle="tooltip" data-placement="top" data-original-title="Lovely"><img src="/images/icon/07.png" className="img-fluid" alt=""
                            onClick={() => onLikeHandler(6)} /></a>
                    </div>
                </div>
            </div>
            <div className="comments mr-4"><i className="ri-chat-3-line text-primary pr-2" />{lengthOfComments} comments</div>
            <div className="share mr-4"><i className="ri-share-forward-line text-primary pr-2" />Share</div>
            <div className="iq-card-post-toolbar">
                <div className="dropdown">
                    <span className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                        <i class="ri-more-fill"></i>
                    </span>
                    <div className="dropdown-menu m-0 p-0">
                        <a className="dropdown-item p-3" href="group-detail.html#">
                            <div className="d-flex align-items-top">
                                <div className="icon font-size-20"><i className="ri-edit-line" /></div>
                                <div className="data ml-2">
                                    <h6>Edit</h6>
                                    <p className="mb-0">Edit for this review.</p>
                                </div>
                            </div>
                        </a>
                        <a className="dropdown-item p-3" href="group-detail.html#">
                            <div className="d-flex align-items-top">
                                <div className="icon font-size-20"><i className="ri-save-line" /></div>
                                <div className="data ml-2">
                                    <h6>Delete</h6>
                                    <p className="mb-0">Deleting for this review.</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(null, { likePost, unlikePost })(Bar);