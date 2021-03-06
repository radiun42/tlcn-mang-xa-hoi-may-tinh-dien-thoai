import React from 'react';
import PostComment from './PostComment';
import { connect } from 'react-redux';

import { getMoreComments } from '../../../actions/post';

const PostComments = ({ postId, comments, getMoreComments, lengthOfComments, isInPosts = false }) => {

    const handleGetMoreComments = () => {
        getMoreComments(postId, comments.length);
    }

    return (
        <>
            {comments.length > 0 && comments.length !== lengthOfComments && !isInPosts && (
                <div className="pb-2">
                    <button className="btn btn-link" onClick={handleGetMoreComments}>View previous comments</button>
                </div>
            )}

            <ul className="post-comments p-0 m-0">
                {comments.slice(0).reverse().map(comment => (
                    <PostComment key={comment._id} comment={comment}
                        postId={postId} />
                ))}
            </ul>
        </>
    )
};

// const mapStateToProps = (state) => ({
//     isInPosts: state.post.isInPosts
// });

export default connect(null, { getMoreComments })(PostComments);