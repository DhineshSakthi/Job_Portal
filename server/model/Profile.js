const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileInfoSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
      default: "",
    },
    personalInfo: {
      phoneNumber: {
        type: Number,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
      about: {
        type: String,
        default: "",
      },
      profilePhoto: {
        type: String,
      },
    },
    education: {
      school: {
        type: Object,
        default: [],
      },
      college: {
        type: Object,
        default: [],
      },
    },
    skills: {
      type: Object,
      default: [],
    },
    experience: {
      type: Object,
      default: [],
    },
    projects: {
      type: Object,
      default: [],
    },
    certifications: {
      type: Object,
      default: [],
    },
    user: {
      object_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfileInfo", profileInfoSchema);
