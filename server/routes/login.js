const express = require("express");
const router = express.Router();
const registerController = require("../controllers/userLogin");

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and generate a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *             example:
 *                username: Kumar123
 *                password: Kumar@123
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *         content:
 *           application/json:
 *             example:
 *               _id: 651bbe2ea74c5096bf2eb89f
 *               username: Gokul
 *               role: User
 *               companyName: 
 *               email: gokul@gmail.com
 *               password: $2b$10$D92omaSnVROk.2VqcSpau.z3XS5Lov5gcXKCcTcqoHhUwycgvQFSO
 *               createdAt: 2023-10-03T07:09:34.521Z
 *               updatedAt: 2023-10-03T07:09:34.604Z
 *               __v: 0
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTFiYmUyZWE3NGM1MDk2YmYyZWI4OWYiLCJpYXQiOjE2OTYzMTY5NzR9.OCTjscO_B5WM0b1iSYvJLVXM1xKO7ihqeaFP9KaN34U
 *       400:
 *         description: Invalid input or missing data.
 *       401:
 *         description: Unauthorized. Wrong username or password.
 *       500:
 *         description: Internal server error.
 */

router.route("/").post(registerController.userLogin);
router.route("/googlelogin").post(registerController.googleLogin)
router.route("/:id").get(registerController.getUserById)
router.route("/reset-password").post(registerController.resetPassword)

module.exports = router;
