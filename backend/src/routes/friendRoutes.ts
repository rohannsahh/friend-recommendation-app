import { Router } from "express";

import User from "../models/user";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware";


const router = Router();




router.get('/list', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { userId } = req.user;

        const user = await User.findById(userId).populate('friends', 'username ');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ friends: user.friends });
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Remove a friend
router.delete('/:friendId', authMiddleware, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { userId } = req.user;
        const { friendId } = req.params;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ error: "User or friend not found" });
        }

        // Check if they are friends
        if (!user.friends.includes(new mongoose.Types.ObjectId(friendId))) {
            return res.status(400).json({ error: "Not friends with this user" });
        }

        // Remove each other from the friends list
        user.friends = user.friends.filter((id) => id.toString() !== friendId);
        friend.friends = friend.friends.filter((id) => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        console.error("Error removing friend:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Search for potential friends (optional, based on username or email)
// router.get('/search', authMiddleware, async (req, res) => {
//     try {
//         const { query } = req.query;
//         const { userId } = req.user;

//         if (!query) {
//             return res.status(400).json({ error: "Query parameter is required" });
//         }

//         const users = await User.find({
//             $or: [
//                 { username: { $regex: query, $options: "i" } },
//                 { email: { $regex: query, $options: "i" } }
//             ],
//             _id: { $ne: userId } // Exclude the authenticated user
//         }).select("username email");

//         res.status(200).json(users);
//     } catch (error) {
//         console.error("Error searching users:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });



router.post('/request', authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.user; 
    const { recipientId } = req.body;

    try {
        // Check if user is trying to send a request to themselves
        if (userId === recipientId) {
            return res.status(400).json({ error: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);
        const sender = await User.findById(userId);

        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        // Check if the recipient is already a friend
        if (recipient.friends.includes(new mongoose.Types.ObjectId(userId))) {
            return res.status(400).json({ error: "You are already friends with this user." });
        }

        // Check if a friend request is already pending
        if (recipient.friendRequests.includes(new mongoose.Types.ObjectId(userId))) {
            return res.status(400).json({ error: "Friend request already sent and pending." });
        }

        recipient.friendRequests.push(new mongoose.Types.ObjectId(userId));
        await recipient.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        console.error('Error in sending friend request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/requests', authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.user;
    try {
        const user = await User.findById(userId).populate('friendRequests', 'username email');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.friendRequests);
    } catch (error) {
        console.error('Error fetching friend requests:', error);
       
    }
});



router.post('/respond',authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { userId } = req.user; 
    const { senderId, action } = req.body;

    try {
        const user = await User.findById(userId);
        const sender = await User.findById(senderId);

        if (!user || !sender) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.friendRequests.includes(senderId)) {
            return res.status(400).json({ error: 'No friend request found' });
        }

        if (action === 'accept') {
            user.friends.push(senderId);
            sender.friends.push(new mongoose.Types.ObjectId(userId));
        }

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== senderId
        );
        await user.save();
        await sender.save();

        res.status(200).json({ message: `Friend request ${action}ed` });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});



router.get('/suggestions', authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId } = req.user;

    try {
        // Fetch the current user and their friends
        const user = await User.findById(userId).populate('friends').exec();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 1: Find users who are not already friends
        const potentialSuggestions = await User.find({
            _id: { $ne: userId, $nin: user.friends.map(friend => friend._id) },
        });

        // Step 2: Calculate mutual friends and common interests
        const suggestions = potentialSuggestions.map(potentialUser => {
            const mutualFriends = user.friends.filter(friend =>
                potentialUser.friends.some(potentialFriend => potentialFriend._id.equals(friend._id))
            );

            const commonInterests = user.interests?.filter(interest =>
                potentialUser.interests?.includes(interest)
            ) || [];

            return {
                user: potentialUser,
                mutualFriendsCount: mutualFriends.length,
                commonInterestsCount: commonInterests.length,
            };
        });

        // Step 3: If no mutual friends or common interests, select random users
        if (suggestions.every(suggestion => suggestion.mutualFriendsCount === 0 && suggestion.commonInterestsCount === 0)) {
            // Fetch random users (limit to 5, you can adjust this number)
            const randomUsers = await User.aggregate([{ $sample: { size: 5 } }]);

            res.status(200).json({
                recommendations: randomUsers.map(user => ({
                    _id: user._id,
                    username: user.username,
                    mutualFriendsCount: 0,
                    commonInterestsCount: 0,
                    interests: user.interests,
                })),
            });

        } else {
            // Step 4: Sort by mutual friends and common interests
            suggestions.sort((a, b) => {
                if (b.mutualFriendsCount !== a.mutualFriendsCount) {
                    return b.mutualFriendsCount - a.mutualFriendsCount;
                }
                return b.commonInterestsCount - a.commonInterestsCount;
            });

            // Step 5: Send the top recommendations (can limit to top 5 or more)
            const topSuggestions = suggestions.slice(0, 5);

            res.status(200).json({
                recommendations: topSuggestions.map(suggestion => ({
                    _id: suggestion.user._id,
                    username: suggestion.user.username,
                    mutualFriendsCount: suggestion.mutualFriendsCount,
                    commonInterestsCount: suggestion.commonInterestsCount,
                    interests: suggestion.user.interests,
                })),
            });
        }

    } catch (error) {
        console.error('Error fetching friend suggestions:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;