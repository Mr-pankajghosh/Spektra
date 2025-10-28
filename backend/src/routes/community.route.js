import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import communitiesData from "../data/communitiesData.js";
import User from "../models/User.js";

const router = express.Router();

let userJoined = {}; // { userId: [communityIds] }
let onlineUsers = {}; // { communityId: Set(userIds) }

router.post("/join/:id", protectRoute, (req, res) => {
  try {
    const userId = req.user._id.toString();
    const communityId = req.params.id;

    if (!userJoined[userId]) userJoined[userId] = [];
    if (!userJoined[userId].includes(communityId)) {
      userJoined[userId].push(communityId);
    }

    return res.json({ success: true, data: userJoined[userId] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get my joined communities
router.get("/my", protectRoute, (req, res) => {
  try {
    const userId = req.user._id.toString();
    const joinedIds = userJoined[userId] || [];
    return res.json({ success: true, data: joinedIds });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get community details (with member counts)
router.get("/:id", protectRoute, async (req, res) => {
  try {
    const communityId = req.params.id;

    const joinedUserIds = Object.keys(userJoined).filter((userId) =>
      userJoined[userId].includes(communityId)
    );

    if (!onlineUsers[communityId]) onlineUsers[communityId] = new Set();

    const memberCount = joinedUserIds.length;
    const onlineCount = onlineUsers[communityId].size;

    const members = joinedUserIds.map((id, index) => ({
      _id: id,
      fullName: `User ${index + 1}`, // anonymized
      profilePic: "", // optional
    }));

    const community = communitiesData.find((c) => c.id === communityId);

    return res.json({
      success: true,
      community,
      members,
      memberCount,
      onlineCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Export router
export default router;
