
import Community from "../models/Community.js";

export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const community = await Community.findById(id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }

    res.json({ message: "Joined successfully", community });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get communities user joined
export const getMyCommunities = async (req, res) => {
  try {
    const userId = req.user._id;
    const communities = await Community.find({ members: userId });
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
