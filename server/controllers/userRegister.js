const UserList = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register of User
const userRegister = async (req, res) => {
  try {
    const { username, email, password, role, companyName } = req.body;

    if (!username || !email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 6 characters.",
      });

    const duplicate = await UserList.findOne({
      $or: [{ username }, { email }],
    });
    if (duplicate)
      return res.status(409).json({
        errorMessage: "An account with this  username or email already exists.",
      });
    const hashedPwd = await bcrypt.hash(password, 10);

    const result = await UserList.create({
      username: username,
      email: email,
      companyName: companyName,
      password: hashedPwd,
      role,
    });
    console.log(result);

    const token = jwt.sign(
      {
        _id: result._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    console.log(token);
    result.token = token;
    await result.save();

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send("Cookies sent");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

const getAllUsernames = async (req, res) => {
  try {
    const users = await UserList.find({}, { username: 1, _id: 0 });
    const usernames = users.map((user) => user.username);
    res.status(200).json(usernames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCompanyNameById = async (req, res) => {
  try {
    const adminId = req.params.id;
    console.log(adminId);
    const admin = await UserList.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }
    const companyName = admin.companyName;

    res.status(200).json({ companyName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userUpdateRegister = async (req, res) => {
  try {
    console.log("inside userupdateRegister", req.body);
    const { username, password } = req.body;
    const userId = req.params.id; // Assuming you pass the user ID as a parameter

    if (!username || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter both username and password." });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 6 characters.",
      });

    const user = await UserList.findById(userId);

    if (!user) return res.status(404).json({ errorMessage: "User not found." });

    // Check if the new username already exists in the database
    const existingUser = await UserList.findOne({ username: username });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({
        errorMessage: "Username already exists. Please choose a different one.",
      });
    }

    // Update the username and password fields
    user.username = username;
    user.password = await bcrypt.hash(password, 10);

    await user.save();

    const token = jwt.sign(
      {
        _id: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    await user.save();

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .send("User details updated and cookies sent");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

// Endpoint to handle password reset
const passwordReset = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  const { newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await UserList.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    //user.resetToken = null; // Assuming resetToken field exists
    await user.save();

    return res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Error resetting password." });
  }
};

module.exports = {
  userRegister,
  getAllUsernames,
  getCompanyNameById,
  userUpdateRegister,
  passwordReset,
};
