const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const skillsSchema = new Schema(
  {
    skills: {
      type: Object,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("skills", skillsSchema);
