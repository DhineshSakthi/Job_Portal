const ProfileInfo = require("../model/Profile");
const User = require("../model/User");


//Post method for new profile info
const createProfileInfo = async (req, res) => {
  try {
    console.log(req.body)
    const profileInfo = new ProfileInfo(req.body);

    await profileInfo.save();
    res.status(201).json(profileInfo);
  } catch (error) {
    console.error("Error creating profile info:", error);
    res.status(500).json({ error: "Unable to create profile info" });
  }
};

//Get method for getting only  user objectIds for Profileinfo
const getAllObjectIds = async (req, res) => {
  try {
    const profiles = await ProfileInfo.find(
      {},
      { "user.object_id": 1, _id: 0 }
    );
    const objectIds = profiles.map((profile) => profile.user.object_id);
    res.status(200).json(objectIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// //Get method for ProfileInfo by userId
const getProfileInfoByUserId = async (req, res) => {
  try {
    const userId = req.params.id;


    const profile = await ProfileInfo.findOne({ 'user.object_id': userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }


    const userObjectId = profile.user.object_id;


    const user = await User.findOne({ _id: userObjectId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const responseData = {
      profileInfo: {
        ...profile.toObject(), 
        userdetails: {
          username: user.username,
          email: user.email,
        },
      },
    };
    

    return res.json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


//Put Method for profile info by ID
const updateProfileInfoById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const updatedProfileData = req.body;

    // Check if the profile exists
    const profile = await ProfileInfo.findOne({"user.object_id":  profileId});
    if (!profile) {
      return res.status(404).json({ error: "Profile info not found" });
    }

    // Update the profile fields with the new data
    profile.set(updatedProfileData);
    const updatedProfileInfo = await profile.save();
    res.json(updatedProfileInfo);
  } catch (error) {
    console.error("Error updating profile info:", error);
    res.status(500).json({ error: "Unable to update profile info" });
  }
};


//delete Method for profile info by ID
const deleteProfileInfoById = async (req, res) => {
  try {
    const profileInfo = await ProfileInfo.findOneAndRemove(req.params.id);
    if (!profileInfo) {
      return res.status(404).json({ error: "Profile info not found" });
    }
    res.json({ message: "Profile info deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile info:", error);
    res.status(500).json({ error: "Unable to delete profile info" });
  }
};

module.exports = {
  createProfileInfo,
  getAllObjectIds,
  getProfileInfoByUserId,
  updateProfileInfoById,
  deleteProfileInfoById,
};
