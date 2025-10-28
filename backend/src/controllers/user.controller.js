import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function completeOnboarding(req, res) {
  const userId = req.user.id;

  try {
    const {
      fullName,
      bio,
      profilePic,
      nativeLanguage,
      learningLanguage,
      location,
      skillsHave,
      skillsLearn,
      gender,
      occupation,
      secretAboutYou,
    } = req.body;

    const skillsHaveArr = Array.isArray(skillsHave)
      ? skillsHave
      : typeof skillsHave === "string"
      ? skillsHave.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const skillsLearnArr = Array.isArray(skillsLearn)
      ? skillsLearn
      : typeof skillsLearn === "string"
      ? skillsLearn.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const updateData = { isOnboarded: true };

    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;
    if (profilePic) updateData.profilePic = profilePic;
    if (nativeLanguage) updateData.nativeLanguage = nativeLanguage;
    if (learningLanguage) updateData.learningLanguage = learningLanguage;
    if (location) updateData.location = location;
    if (skillsHaveArr.length) updateData.skillsHave = skillsHaveArr;
    if (skillsLearnArr.length) updateData.skillsLearn = skillsLearnArr;
    if (gender) updateData.gender = gender;
    if (occupation) updateData.occupation = occupation;
    if (secretAboutYou) updateData.secretAboutYou = secretAboutYou; 

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Onboarding error:", error.message);
    res.status(500).json({ message: "Onboarding failed", error: error.message });
  }
}

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    // fallback if friends is undefined
    const friendIds = currentUser.friends || [];

    const recommendedUsers = await User.find({
      _id: { $ne: currentUserId, $nin: friendIds },
      // isOnboarded: true, // <- uncomment if you want only onboarded
    }).select(
      "fullName profilePic nativeLanguage learningLanguage skillsHave skillsLearn bio location isOnboarded"
    );

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage skillsHave skillsLearn");

    if (!user) return res.status(404).json([]);
res.status(200).json(user.friends || []);

  } catch (error) {
    console.error("Error in getMyFriends", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId)
      return res.status(400).json({ message: "You can't send friend request to yourself" });

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });

    if (recipient.friends.includes(myId))
      return res.status(400).json({ message: "You are already friends with this user" });

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest)
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });

    if (friendRequest.recipient.toString() !== req.user.id)
      return res.status(403).json({ message: "You are not authorized to accept this request" });

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    // Incoming friend requests (pending requests sent to me)
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    // Sent friend requests (pending requests I sent)
    const sentReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    // Accepted requests (either I accepted or someone accepted me)
    const acceptedReqs = await FriendRequest.find({
      $or: [
        { sender: req.user.id, status: "accepted" },
        { recipient: req.user.id, status: "accepted" },
      ],
    })
      .populate("sender", "fullName profilePic")
      .populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, sentReqs, acceptedReqs });
  } catch (error) {
    console.error("Error in getFriendRequests", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
  sender: req.user.id,
  status: "pending",
}).populate("recipient", "fullName profilePic nativeLanguage learningLanguage skillsHave skillsLearn");

const safeRequests = outgoingRequests.filter(req => req.recipient !== null);

res.status(200).json(safeRequests);

  } catch (error) {
    console.error("Error in getOutgoingFriendReqs", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
