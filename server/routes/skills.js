const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skills");



router.route("/").post(skillController.addSkill);
router.route("/").get(skillController.getAllSkills);

module.exports = router;