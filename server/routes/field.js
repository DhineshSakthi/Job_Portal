const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/fields");

router.route("/").post(fieldController.addFields);
router.route("/:key").get(fieldController.getFieldByKey);

module.exports = router;
