const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const moment = require('moment');

const API_URL = 'https://radiun42-tlcn-mang-xa-hoi-may-tinh-dien-thoai-gv4q-3001.githubpreview.dev' || process.env.API_URL;
const APP_URL = 'https://radiun42-tlcn-mang-xa-hoi-may-tinh-dien-thoai-gv4q-3000.githubpreview.dev';

const auth = require('../../middleware/auth');
const getUserByToken = require('../../middleware/getUserByToken');
const isEmptyObject = require('../../utils/isEmptyObject');
const { canAddActivity } = require('../../utils/ads/ads');
const paypal = require('../../utils/paypal/paypal');

const Ads = require('../../models/ads');
const Post = require('../../models/post');
const Profile = require('../../models/profile');

// @route GET /api/ads
// @desc Get a ads.
// @access public
router.get('/', getUserByToken, async (req, res) => {
    try {

        const extendPipe = {};

        if (req.user) {
            const profile = await Profile.findOne({ user: req.user.id })
                .select({ dateOfBirth: 1 });

            const userYearsOld = moment().diff(moment(profile.dateOfBirth), 'years');

            extendPipe.$match = {
                'audience.age.from': {
                    $lte: userYearsOld
                },
                'audience.age.to': {
                    $gte: userYearsOld
                },
                $or: [
                    {
                        'audience.gender': {
                            $eq: 'all'
                        }
                    },
                    {
                        $and: [
                            {
                                'audience.gender': {
                                    $ne: 'all'
                                }
                            },
                            {
                                'audience.gender': {
                                    $eq: req.user.gender
                                }
                            }
                        ]
                    }
                ]
            };
        }

        // Find 2 random sample to repose client
        const pipeline = [
            {
                $sample: { size: 2 }
            },
            // Populate post by Id
            {
                $lookup: {
                    from: Post.collection.name,
                    localField: 'post',
                    foreignField: '_id',
                    as: 'post'
                }
            },
            // After populate post became array type, convert to object
            {
                $unwind: '$post'
            },
            {
                $project: {
                    owner: 1,
                    post: 1,
                    name: 1,
                }
            }
        ];

        if (!isEmptyObject(extendPipe)) {
            pipeline.unshift(extendPipe);
        }

        const ads = await Ads.aggregate(pipeline);

        // Response to client
        res.json(ads);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route POST /api/ads
// @desc Create a ads.
// @access private
router.post('/', auth, [
    body('name', 'Name is required').not().isEmpty(),
    body('post', 'Post ID is required').not().isEmpty(),
    body('audience', 'Audience is required').not().isEmpty()
], async (req, res) => {
    try {
        // 1. Validation
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find post if owner is current user
        const post = await Post.findOne({ _id: req.body.post, user: req.user._id });

        if (!post) {
            return res.status(400).send('Post is not yours. Please try other posts.');
        }

        // 2. Create and Save
        const ads = await Ads.create({
            name: req.body.name,
            post: post._id,
            owner: req.user._id,
            audience: req.body.audience
        });

        // 3. Response to client
        res.json(ads);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route GET /api/ads/posts
// @desc Find owner post of current user.
// @access private
router.get('/posts', auth, async (req, res) => {
    try {
        // 1. Create filters to find
        const { limit = 5, skip = 0, headline } = req.query;

        const conditions = {
            user: req.user._id,
            'type.user': { $exists: true }
        };

        if (headline) {
            conditions.text = { '$regex': headline, $options: 'i' };
        }
        // 2. Find posts
        const posts = await Post.find(conditions)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // 3. Response to client
        res.json(posts);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route GET /api/ads/check-ads?name=string
// @desc Check If Name Ads compaign is not exsits.
// @access private
router.get('/check-ads', auth, async (req, res) => {
    try {
        const { name = '' } = req.query;

        // Find new name ad compaign not exists.
        const ads = await Ads.findOne({ owner: req.user._id, name });

        // Response to client if ads has existed.
        if (ads) {
            return res.json({ exists: true });
        }

        return res.json({ exists: false });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PUT /api/ads/:ads_id/click
// @desc Tracking user click view on ads
// @access public
// non-run
router.put('/:id/click', getUserByToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send('Ads Id is required.');
        }

        // Find new name ad compaign not exists.
        const ads = await Ads.findById(id).sort({ 'activities.date': 'desc' });

        // Response to client if ads has existed.
        if (!ads) {
            return res.status(400).json({ msg: 'Ads is not found.' });
        }

        // Find ads and get recently activity to compute next activity.
        const result = canAddActivity(ads.activities);

        if (result) {
            ads.activities.push({
                user: req.user.id
            });

            await ads.save();
        }

        res.json('Ok');
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route GET /api/ads/create/status
// @desc Check user has created ad yet.
// @access private
router.get('/create/status', auth, async (req, res) => {
    try {
        // Get length of Ads that user created.
        const count = await Ads.countDocuments();

        // Check true if user has created before.
        const body = count > 0;

        res.json(body);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route GET /api/ads/list?skip=0&limit=5
// @desc Check user has created ad yet.
// @access private
router.get('/list', auth, async (req, res) => {
    try {
        // Get Query
        // Limit post and pages
        const limit = parseInt(req.query.limit) || 2;
        const page = parseInt(req.query.page) || 1;

        // Server decides page size
        const skip = (page - 1) * limit;

        // Count Ads user has create before that.
        const totalAds = await Ads.find({ owner: req.user._id }).countDocuments() || 0;

        const ads = await Ads.find({ owner: req.user._id })
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .populate('post', '-comments');

        // Reponse client about data and pagination info
        res.json({
            ads,
            currentPage: page,
            pages: Math.ceil(totalAds / limit)
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route POST /api/ads/:id/purchase
// @desc User purchases advertisement compaign to active
// @access private
router.post('/:id/purchase', async (req, res) => {
    try {
        const adsId = req.params.id;

        if (!adsId) {
            return res.status(400).send('Ads Id is required.');
        }

        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${API_URL}/api/ads/purchase/success?adsId=${adsId}`,
                "cancel_url": `${API_URL}/api/ads/purchase/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Advertisement Compaign",
                        "sku": "item",
                        "price": "5.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "5.00"
                },
                "description": "Please purchase advertisement compaign to active."
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {

                if (payment && payment.links) {
                    // Link redirect client to login paypal account to pay
                    const approval_url = payment.links.find(link => link.rel === 'approval_url');

                    if (!approval_url) {
                        return res.status(500).send('Server is errors.');
                    }

                    res.json(approval_url.href);
                }
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route GET /api/ads/purchase/success
// @desc User logins paypal account and checkout
// @access public
router.get('/purchase/success', (req, res) => {
    try {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const adsId = req.query.adsId;

        var execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "5.00"
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                res.status(500).send('Server is errors.');
            } else {
                //console.log(JSON.stringify(payment));
                // Active AD User has purchased ad compagin.
                Ads.findByIdAndUpdate(adsId, { status: 1 }).exec((error) => {
                    if (error) {
                        console.log(error.response);
                        res.redirect(`${APP_URL}/ads/create?status=fail&adsId=${adsId}`);
                    }

                    res.redirect(`${APP_URL}/ads/create?status=successed&adsId=${adsId}`);
                });
            }
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route GET /api/ads/purchase/cancel
// @desc User logins paypal account but cancel.
// @access public
router.get('/purchase/cancel', async (req, res) => {
    try {
        res.redirect(`${APP_URL}/ads/create?status=canceled`);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

// @route PATCH /api/ads/purchase/cancel
// @desc Active or Paused advertising compaign
// @access private
router.patch('/:id/status', auth, async (req, res) => {
    try {

        const adsId = req.params.id;

        if (!!!adsId) {
            return res.status(400).send('Ads Id is required.');
        }

        const ad = await Ads.findById(adsId);

        if (ad.owner !== req.user.id) {
            return res.status(400).json({ msg: 'Advertising is not yours.' });
        }

        // Toggle Status
        ad.status = ad.status === 1 ? 0 : 1;

        await ad.save();

        res.json(ad);
    }
    catch (e) {
        console.log(e);
        res.status(500).send('Server is errors.');
    }
});

module.exports = router;