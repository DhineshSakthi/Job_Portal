const Fields = require("../model/fields");

const addFields = async (req, res) => {
  try {
    const { collegeFields, collegeDegrees, schoolFields } = req.body;

    const fields = new Fields({
      collegeFields,
      collegeDegrees,
      schoolFields,
    });

    const savedFields = await fields.save();

    res.status(201).json(savedFields);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while saving the data." });
  }
};

const getFieldByKey = async (req, res) => {
  try {
    const fieldKey = req.params.key;

    const data = await Fields.findOne({}, `${fieldKey}`); 

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    const fieldValue = data[fieldKey];
    res.json(fieldValue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addFields,
  getFieldByKey,
};
