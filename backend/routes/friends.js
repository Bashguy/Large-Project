import express from 'express';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';

const router = express.Router();

const auth = (req, res, next) => {
    req.user = { _id: new ObjectId("64b2f1f4173a4d9e3f4a9c78") };
    next();
};

router.use(auth);

router.post('/friend-request/:id', async (req, res) => {
    const db = req.app.locals.db;
    const users = db.collection('users');

    const targetId = new ObjectId(req.params.id);
    const userId = req.user._id;

    if (targetId.equals(userId)) return res.status(400).send('Cannot friend yourself');

    const [sender, receiver] = await Promise.all([
        users.findOne({ _id: userId }),
        users.findOne({ _id: targetId })
    ]);

    if (!receiver) return res.status(404).send('User not found');
    if ((receiver.friendRequests || []).includes(userId) || (receiver.friends || []).includes(userId)) {
        return res.status(400).send('Already requested or already friends');
    }

    await Promise.all([
        users.updateOne({ _id: userId }, { $addToSet: { sentRequests: targetId } }),
        users.updateOne({ _id: targetId }, { $addToSet: { friendRequests: userId } })
    ]);

    res.send('Friend request sent');
});

router.post('/accept-request/:id', async (req, res) => {
    const db = req.app.locals.db;
    const users = db.collection('users');

    const requesterId = new ObjectId(req.params.id);
    const userId = req.user._id;

    await Promise.all([
        users.updateOne({ _id: userId }, {
            $pull: { friendRequests: requesterId },
            $addToSet: { friends: requesterId }
        }),
        users.updateOne({ _id: requesterId }, {
            $pull: { sentRequests: userId },
            $addToSet: { friends: userId }
        })
    ]);

    res.send('Friend request accepted');
});

router.post('/decline-request/:id', async (req, res) => {
    const db = req.app.locals.db;
    const users = db.collection('users');

    const requesterId = new ObjectId(req.params.id);
    const userId = req.user._id;

    await Promise.all([
        users.updateOne({ _id: userId }, { $pull: { friendRequests: requesterId } }),
        users.updateOne({ _id: requesterId }, { $pull: { sentRequests: userId } })
    ]);

    res.send('Friend request declined');
});

router.get('/my-friends', async (req, res) => {
    const db = req.app.locals.db;
    const users = db.collection('users');

    const user = await users.findOne({ _id: req.user._id });
    if (!user) return res.status(404).send('User not found');

    const friends = await users.find({ _id: { $in: user.friends || [] } }).toArray();
    res.json(friends);
});

export default router;

router.post('/remove-friend/:id', async (req, res) => {
    const db = req.app.locals.db;
    const users = db.collection('users');

    const friendId = new ObjectId(req.params.id);
    const userId = req.user._id;

    if (friendId.equals(userId)) return res.status(400).send('Cannot remove yourself');

    const [user, friend] = await Promise.all([
        users.findOne({ _id: userId }),
        users.findOne({ _id: friendId })
    ]);

    if (!user || !friend) return res.status(404).send('User or friend not found');
    if (!user.friends.includes(friendId)) return res.status(400).send('You are not friends with this user');

    await Promise.all([
        users.updateOne({ _id: userId }, { $pull: { friends: friendId } }),
        users.updateOne({ _id: friendId }, { $pull: { friends: userId } })
    ]);

    res.send('Friend removed');
});
