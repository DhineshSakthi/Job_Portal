const UserList = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const CLIENT_ID =
  "202621132385-p7hnhja3lhkqeb6i2isqn14970jqbjhn.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required." });

    const foundUser = await UserList.findOne({ username });
    if (!foundUser)
      return res.status(401).json({ errorMessage: "Invalid Username" });

    const passwordCorrect = await bcrypt.compare(password, foundUser.password);

    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Invalid password" });

    const token = jwt.sign(
      {
        user: foundUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .json(foundUser);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};

const googleLogin = async (req, res) => {
  console.log(req.body);
  const tokenId = req.body.tokenId;
  console.log(tokenId);
  const { role } = req.body;
  console.log(role);

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    let foundUser = await UserList.findOne({ email });

    if (!foundUser) {
      const newUser = new UserList({
        email: email,
        role,
      });

      const token = jwt.sign(
        {
          _id: newUser._id.toString(),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      newUser.token = token;
      foundUser = await newUser.save(); // Save the new user
    } else {
      const token = jwt.sign(
        {
          user: foundUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1m",
        }
      );

      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(foundUser); // Send the foundUser for existing user login
      return; // Exit the function for existing user
    }

    const token = jwt.sign(
      {
        user: foundUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(foundUser); // Send the foundUser for new user registration
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserList.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.username || !user.password) {
      return res.status(400).json({ message: "User missing credentials" });
    }

    return res
      .status(200)
      .json({ message: "User has username and password", user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  console.log(email);

  try {
    const user = await UserList.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const token = jwt.sign(
      {
        UserId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const UserId = user._id;

    // Generate a password reset token
    //const token = crypto.randomBytes(20).toString('hex');
    // user.resetPasswordToken = token;
    // user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // Example: Sending password reset link using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kdhinesh173@gmail.com",
        pass: "rnno bhpq qcuh dfhi",
      },
    });

    const mailOptions = {
      from: "kdhinesh173@gmail.com",
      to: email,
      subject: "Password Reset Link",
      html: `<p>You have requested a password reset. Click <a href="http://localhost:3000/password-reset/${UserId}/${token}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error sending password reset link:", error);
    return res
      .status(500)
      .json({ message: "Error sending password reset link." });
  }
};

module.exports = { userLogin, googleLogin, getUserById, resetPassword };
