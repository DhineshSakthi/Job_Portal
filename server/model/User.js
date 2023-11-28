const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      //require: true,
    },
    role: {
      type: String,
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      //require: true,
    },
    token: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
