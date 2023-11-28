const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const multer = require("multer");
const auth = require("../middleware/verifyJWT")

/**
 * @swagger
 * /application:
 *   post:
 *     summary: Submit a job application
 *     description: Submit a job application for a specific job posting.
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: Apply jobs using user id
 *       - in: path
 *         name: job_id
 *         required: true
 *         description: Apply jobs using Job id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email: 
 *                 type: string
 *               phoneNumber: 
 *                 type: number
 *               location:
 *                 type: string
 *               schoolPercentage:
 *                 type: number
 *               collegeDegree:
 *                 type: string
 *               fieldOfStudy:
 *                 type: string
 *               collegePercentage:
 *                 type: number
 *               skills:
 *                 type: string
 *               experience:
 *                 type: string
 *               projects:
 *                 type: string
 *               certifications:
 *                 type: string
 *             example:
 *               name: Gokul
 *               email: gokul@gmail.com
 *               phoneNumber: 6789875998
 *               location: Tamil Nadu
 *               schoolPercentage: 67
 *               collegeDegree: Master of Architecture (M.Arch.)
 *               fieldOfStudy: Interior Design
 *               collegePercentage: 78
 *               skills: [Node js, React js]
 *               experience: Five years experience in TCS
 *               projects: Aluminium metal matrix Composite
 *               certifications: Machine Learning
 *           required:
 *               - name
 *               - email
 *               - phoneNumber
 *               - location
 *               - schoolPercentage
 *               - collegeDegree
 *               - fieldOfStudy
 *               - collegePercentage
 *               - skills
 *               - projects
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   type: string
 *                   format: binary
 *                   description: The resume file to upload (if applicable).
 *     responses:
 *       201:
 *         description: Application submitted successfully.
 *         content:
 *           application/json:
 *             example:
 *               _id: 6538dd2563589e1bbf1d105c
 *               name: Gokul
 *               email: gokul@gmail.com
 *               phoneNumber: 6789875998
 *               location: Tamil Nadu
 *               schoolPercentage: 67
 *               collegeDegree: Master of Architecture (M.Arch.)
 *               fieldOfStudy: Interior Design
 *               collegePercentage: 78
 *               skills: [Node js, React js]
 *               experience: Five years experience in TCS
 *               projects: Aluminium metal matrix Composite
 *               certifications: Machine Learning
 *               status: Hiring closed 
 *               resumePath: 6538d87484eb598cacd75990_651bbe2ea74c5096bf2eb89f_Alumni asssociation
 *               createdAt: 2023-10-25T09:17:25.702+00:00
 *               updatedAt: 2023-11-01T07:04:50.964+00:00
 *               __v: 0
 *       400:
 *         description: Bad request. You have already applied for this job.
 *       401:
 *         description: Unauthorized. Token is needed.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get applied jobs for a specific user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the user.
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: List of applied jobs for the user.
 *       401:
 *         description: Unauthorized. Token is needed.
 *       500:
 *         description: Internal server error.

 *   put:
 *     summary: Update the status of an applicant.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the applicant.
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Applicant status updated successfully.
 *       401:
 *         description: Unauthorized. Token is needed.
 *       500:
 *         description: Internal server error.

 * @swagger
 * /applications/alljobs/{id}:
 *   get:
 *     summary: Get jobs and applicants for an admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the admin.
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: List of jobs and applicants for the admin.
 *       401:
 *         description: Unauthorized. Token is needed.
 *       500:
 *         description: Internal server error.
 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    const jobId = req.query.jobId;
    const userId = req.query.userId;
    const originalFilename = file.originalname;
    const modifiedFilename = `${jobId}_${userId}_${originalFilename}`;
    cb(null, modifiedFilename);
  },
});

const uploadStorage = multer({ storage: storage });

// Single file upload route
router.post("/uploadResume", uploadStorage.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // The file was successfully uploaded
  return res.status(201).json({
    path: req.file.filename,
  });
});

router.route("/").post(auth, applicationController.applicationPosting);
router
  .route("/check/:jobId/:userId")
  .get(applicationController.checkApplication);
router.route("/:id").get( auth, applicationController.getAppliedJobs);
router
  .route("/alljobs/:id")
  .get(auth, applicationController.getJobsAndApplicantsForAdmin);
  router
  .route("/statistics/:id")
  .get(auth, applicationController.getApplicationStatistics);
router.route("/:id").put(applicationController.updateApplicantStatusById);

module.exports = router;
