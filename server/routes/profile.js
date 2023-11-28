const express = require("express");
const router = express.Router();
const profileController = require("../controllers/userProfile");
const auth = require("../middleware/verifyJWT")

/**
 * @swagger
 * paths:
 *   /profile:
 *     post:
 *       summary: Create a new user profile
 *       description: Create a new user profile information.
 *       security:
 *         - JWT: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileInfo'
 *             example:
 *               ProfileInfo:
 *                 name: Vishal
 *                 dateOfBirth: 2003-06-13T00:00:00.000+00:00    
 *                 personalInfo:
 *                   phoneNumber: 7094009890         
 *                   location: Kerala
 *                   about: This is my bio
 *                 education:
 *                   school: [Immaculate, Bio-Maths, 98]
 *                   college: [Anna university, B.E, Production, 89] 
 *                 skills: [React js, node js]
 *                 experience: [TCS]
 *                 projects: [Job portal, Job portal using MERN stack]
 *                 certifications: [Mern developer, Two months training course]
 *       responses:
 *         201:
 *           description: User profile created successfully.
 *         401:
 *           description: Unauthorized. Authentication token is missing or invalid.
 *         500:
 *           description: Internal server error.

 *   /profile/{id}:
 *     get:
 *       summary: Get user profile information by user ID
 *       description: Get user profile information by user ID.
 *       security:
 *         - JWT: []
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the user.
 *       responses:
 *         200:
 *           description: User profile information retrieved successfully.
 *         401:
 *           description: Unauthorized. Authentication token is missing or invalid.
 *         500:
 *           description: Internal server error.

 *     put:
 *       summary: Update user profile information by profile ID
 *       description: Update user profile information by profile ID.
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The ID of the user profile.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileInfo' 
 *       responses:
 *         200:
 *           description: User profile information updated successfully.
 *         500:
 *           description: Internal server error.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileInfo:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         personalInfo:
 *           type: object
 *           properties:
 *             phoneNumber:
 *               type: number
 *             location:
 *               type: string
 *             about:
 *               type: string
 *         education:
 *           type: object
 *           properties:
 *             school:
 *               type: string
 *             college:
 *               type: string
 *         skills:
 *           type: string
 *         experience:
 *           type: string
 *         projects:
 *           type: string
 *         certifications:
 *           type: string
 */



router.route("/").post(auth, profileController.createProfileInfo);
router.route("/").get(profileController.getAllObjectIds);
router.route("/:id").get(auth, profileController.getProfileInfoByUserId);
router.route("/:id").put(auth, profileController.updateProfileInfoById);
router.route("/:id").delete(profileController.deleteProfileInfoById);

module.exports = router;