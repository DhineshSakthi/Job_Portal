const mongoose = require("mongoose");
const { stringify } = require("uuid");
const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: Number,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    schoolPercentage: {
      type: Number,
      default: "",
    },
    collegeDegree: {
      type: String,
      default: "",
    },
    fieldOfStudy: {
      type: String,
    },
    collegePercentage: {
      type: Number,
      default: "",
    },
    skills: {
      type: Object,
      default: [],
    },
    experience: {
      type: String,
    },
    projects: {
      type: String,
    },
    certifications: {
      type: String,
    },
    status: {
      type: String,
      default: "Reviewing",
    },
    resumePath: {
      type: String,
    },
    job_id: {
      object_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    user: {
      object_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
