const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fieldsSchema = new Schema(
  {
    collegeFields: {
      type: Object,
      default: [],
    },
    collegeDegrees: {
      type: Object,
      default: [],
    },
    schoolFields: {
      type: Object,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Fields", fieldsSchema);
