const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

const auth = (req, res, next) => {
    req.user = { _id: new ObjectId("64b2f1f4173a4d9e3f4a9c78") }; // simulate logged-in user
    next();
};

router.use(auth);

router.post('/trade-request/:friendId', async (req, res) => {
    const db = req.app.locals.db;
    const users = db.collection('users');
    const trades = db.collection('trades');

    const senderId = req.user._id;
    const receiverId = new ObjectId(req.params.friendId);
    const { offeredItems = [], requestedItems = [] } = req.body;

    if (senderId.equals(receiverId)) return res.status(400).send('Cannot trade with yourself');

    const sender = await users.findOne({ _id: senderId });
    const receiver = await users.findOne({ _id: receiverId });

    if (!receiver) return res.status(404).send('Friend not found');
    if (!receiver.friends?.includes(senderId.toString())) return res.status(400).send('Not friends');

    const trade = {
        sender: senderId,
        receiver: receiverId,
        offeredItems,
        requestedItems,
        status: 'pending',
        createdAt: new Date()
    };

    const result = await trades.insertOne(trade);
    res.status(201).json({ message: 'Trade request sent', tradeId: result.insertedId });
});

router.get('/my-trade-requests', async (req, res) => {
    const db = req.app.locals.db;
    const trades = db.collection('trades');

    const tradeRequests = await trades.find({
        receiver: req.user._id,
        status: 'pending'
    }).toArray();

    res.json(tradeRequests);
});

router.post('/accept-trade/:tradeId', async (req, res) => {
    const db = req.app.locals.db;
    const trades = db.collection('trades');

    const tradeId = new ObjectId(req.params.tradeId);
    const trade = await trades.findOne({ _id: tradeId });

    if (!trade) return res.status(404).send('Trade not found');
    if (!trade.receiver.equals(req.user._id)) return res.status(403).send('Not your trade');
    if (trade.status !== 'pending') return res.status(400).send('Already processed');


    await trades.updateOne({ _id: tradeId }, { $set: { status: 'accepted', resolvedAt: new Date() } });
    res.send('Trade accepted');
});

router.post('/decline-trade/:tradeId', async (req, res) => {
    const db = req.app.locals.db;
    const trades = db.collection('trades');

    const tradeId = new ObjectId(req.params.tradeId);
    const trade = await trades.findOne({ _id: tradeId });

    if (!trade) return res.status(404).send('Trade not found');
    if (!trade.receiver.equals(req.user._id)) return res.status(403).send('Not your trade');
    if (trade.status !== 'pending') return res.status(400).send('Already processed');

    await trades.updateOne({ _id: tradeId }, { $set: { status: 'declined', resolvedAt: new Date() } });
    res.send('Trade declined');
});

module.exports = router;
