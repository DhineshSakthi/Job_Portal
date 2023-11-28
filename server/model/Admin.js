const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    employerName: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    jobDescription: {
      type: String,
      default: "",
    },
    requiredSkills: [String],
    applicationDeadline: {
      type: Date,
      default: "",
    },
    salaryRange: {
      type: String,
      default: "",
    },
    jobType: {
      type: String,
      default: "",
    },
    jobStatus: {
      type: String,
      default: "active",
    },
    admin: {
      object_id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      companyName: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", userSchema);
