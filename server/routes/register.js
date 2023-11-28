const express = require("express");
const router = express.Router();
const registerController = require("../controllers/userRegister");
const auth = require("../middleware/verifyJWT")

router.route("/").post(registerController.userRegister);
router.route("/").get(registerController.getAllUsernames);
router.route("/:id").get(registerController.getCompanyNameById);
router.route("/:id").put(registerController.userUpdateRegister);
router.route("/password/:id").put(auth, registerController.passwordReset);

module.exports = router;
