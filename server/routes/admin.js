const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const auth = require("../middleware/verifyJWT");
const csv = require("csv-parser");
const fs = require("fs");

/**
 * @swagger
 * /admin/uploadcsv:
 *   post:
 *     summary: Upload a CSV file.
 *     description: Upload a CSV file for processing.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     parameters:
 *       - in: query
 *         name: admin_id
 *         required: true
 *         description: The ID of the admin creating the job posting as the multiple jobs
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV file uploaded and processed successfully.
 *       400:
 *         description: No file uploaded.
 *       500:
 *         description: Error reading or processing the uploaded file.
 */

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Create a new job posting
 *     description: Create a new job posting by an admin user.
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employerName:
 *                 type: string
 *               jobtitle:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *               requiredSkills:
 *                 type: string
 *               salaryRange:
 *                 type: string
 *               jobType:
 *                 type: string
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *             example:
 *               employerName: Nethesh
 *               jobTitle: System Analyst
 *               city: Chennai
 *               state: TamilNadu
 *               jobDescription: Two year experience needed
 *               requiredSkills: React JS
 *               salaryRange: 90,000
 *               jobType: Full-Time
 *               applicationDeadline: 2023-11-05
 *     parameters:
 *       - in: query
 *         name: admin_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the admin creating the job posting.
 *     responses:
 *       201:
 *         description: Job posting created successfully.
 *         content:
 *           application/json:
 *             example:
 *               _id: 65373171bb28c839e6c72596
 *               employerName: Nethesh
 *               jobTitle: System Analyst
 *               city: Chennai
 *               state: TamilNadu
 *               jobDescription: Two year experience needed
 *               requiredSkills: [React JS, Node JS]
 *               salaryRange: 90,000
 *               jobType: Full-time
 *               applicationDeadline: 2023-11-10T00:00:00.000+00:00
 *               admin: Object
 *               createdAt: 2023-10-03T07:09:34.521Z
 *               updatedAt: 2023-10-03T07:09:34.604Z
 *               __v: 0
 *               jobStatus: active
 *  
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get all job postings.
 *     description: Retrieve a list of all job postings.
 *     responses:
 *       200:
 *         description: List of job postings retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get a job posting by Admin ID.
 *     description: Retrieve a job posting by its  Admin ID.
 *     parameters:
 *       - in: path
 *         name: admin_id
 *         required: true
 *         type: string
 *         description: Get jobs by their admin ID
 *     authentication:
 *       - type: JWT
 *     responses:
 *       200:
 *         description: Job posting information retrieved successfully.
 *       401:
 *         description: Unauthorized. Token is needed.
 *       500:
 *         description: Internal server error.
 *   put:
 *     summary: Update a job posting by ID.
 *     description: Update a job posting using its ID.
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         description: Job Posting ID
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Job posting updated successfully.
 *       401:
 *         description: Unauthorized. Token is needed.
 *       500:
 *         description: Internal server error.
 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "CSV/"); // Set the destination folder for CSV files
  },
  filename: (req, file, cb) => {
    const adminId = req.query.adminId;
    const originalFilename = file.originalname;
    const modifiedFilename = `${adminId}_${originalFilename}`;
    cb(null, modifiedFilename);
  },
});

const uploadStorage = multer({ storage: storage });
router.post("/uploadcsv", uploadStorage.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const csvFilePath = `CSV/${req.file.filename}`;
    const adminId = req.query.adminId;

    fs.readFile(csvFilePath, "utf8", async (err, csvData) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error reading the uploaded file." });
      }
      await adminController.parseCSVAndInsertIntoDB(csvData, adminId, req, res);
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error processing the uploaded file." });
  }
});

router.route("/").post(auth, adminController.createJobPosting);
router.route("/").get(auth, adminController.getAllJobPostings);
router
  .route("/:id")
  .get(auth, adminController.getJobPostingByAdminId)
  .put(auth, adminController.updateJobPostingById);

module.exports = router;
