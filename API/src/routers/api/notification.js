const router = require('express').Router();
const { param, validationResult } = require('express-validator');

const Notification = require('../../models/notification');
const auth = require('../../middleware/auth');

// @route GET /api/notification
// @desc Get current notification. 
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 1;

        if (skip < 0 || limit < 0) {
            return res.status(400).send('Skip or limit must be positive.');
        }

        const notification = await Notification.findOne({ user: req.user._id },
            {
                messages: {
                    $slice: [skip, limit]
                }
            }).populate('messages.user', 'avatar');

        res.json(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route GET /api/notification/more
// @desc Get more current notification. 
// @access Private
router.get('/more', auth, async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 1;

        if (skip < 0 || limit < 0) {
            return res.status(400).send('Skip or limit must be positive.');
        }

        const notification = await Notification.findOne({ user: req.user._id },
            {
                messages: {
                    $slice: [skip, limit]
                }
            }).populate('messages.user', 'avatar');

        res.json(notification.messages);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/notification/markasread/:id
// @desc Make as read a message.
// @access Private
router.put('/markasread/:id', auth, async (req, res) => {
    try {

        const messageId = req.params.id;

        if (!messageId) {
            return res.status(400).send('Can not make as read.');
        }

        // Find notification and make message status true.
        const notification = await Notification.findOneAndUpdate({
            user: req.user._id,
            'messages._id': messageId
        }, {
            $set: {
                'messages.$.status': true
            }
        });

        if (!notification) {
            return res.status(404).send('Notification not found.');
        }

        res.send(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/notification/markasreadall
// @desc Make as read all messages.
// @access Private
router.put('/markasreadall', auth, async (req, res) => {
    try {
        // Find notification and make message status true.
        const notification = await Notification.findOneAndUpdate({ user: req.user._id }, {
            $set: {
                'messages.$[].status': true
            }
        });

        if (!notification) {
            return res.status(404).send('Notification not found.');
        }

        res.send(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/notification/following/:id
// @route-param id Object's Id which user wants follow.
// @desc Registry following post. 
// @access Private
router.put('/following/:id', auth, async (req, res) => {
    try {
        const postId = req.params.id;

        if (!!!postId) {
            return res.status(400).send('Can\'\t following.');
        }

        const notification = await Notification.findOne({
            user: req.user._id,
            'followingPosts': { $nin: postId }
        });

        if (!notification) {
            return res.status(400).json({ msg: 'User has followed yet.' });
        }

        notification.followingPosts.push(postId);

        await notification.save();

        res.json(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/notification/unfollowing/:id
// @route-param id Object's Id which user wants unfollow.
// @desc Registry unfollowing post. 
// @access Private
router.put('/unfollowing/:id', auth, async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return res.status(400).send('Can\'\t unfollowing.');
        }

        const notification = await Notification.findOne({
            user: req.user._id,
            'followingPosts': postId
        });

        if (!notification) {
            return res.status(400).json({ msg: 'User has not followed yet.' });
        }

        notification.followingPosts.pull(postId);

        await notification.save();

        res.json(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/notification/groups/:id/following
// @route-param id Object's Id which user wants follow.
// @desc Registry following group. 
// @access Private
router.put('/groups/:id/following', auth, [
    param('id', 'Group id is required.').not().isEmpty()
], async (req, res) => {
    try {
        //Validation params
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array() });
        }

        const groupId = req.params.id;

        const notification = await Notification.findOne({
            user: req.user._id,
            'notificationGroups': { $nin: groupId }
        });

        if (!notification) {
            return res.status(400).json({ msg: 'Group has subcribed yet.' });
        }

        notification.notificationGroups.push(groupId);

        await notification.save();

        res.json(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/notification/unfollowing/:id
// @route-param id Object's Id which user wants unfollow.
// @desc Registry unfollowing post. 
// @access Private
router.put('/groups/:id/unfollowing', auth, [
    param('id', 'Group id is required.').not().isEmpty()
], async (req, res) => {
    try {
        //Validation params
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array() });
        }

        const groupId = req.params.id;

        const notification = await Notification.findOne({
            user: req.user._id,
            'notificationGroups': groupId
        });

        if (!notification) {
            return res.status(400).json({ msg: 'Group has not subcribed yet.' });
        }

        notification.notificationGroups.pull(groupId);

        await notification.save();

        res.json(notification);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

module.exports = router;