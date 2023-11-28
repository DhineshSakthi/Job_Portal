const Admin = require("../model/Admin");
const User = require("../model/User");
const Application = require("../model/Application");
const { Readable } = require("stream");
const csv = require("csv-parser");
const fs = require("fs");
const adminValidation = require("./csvValidation");

//Post method for new profile info
const createJobPosting = async (req, res) => {
  try {
    const jobPosting = new Admin(req.body);
    await jobPosting.save();
    res.status(201).json(jobPosting);
  } catch (error) {
    console.error("Error creating jobPosting:", error);
    res.status(500).json({ error: "Unable to create jobPosting" });
  }
};

const parseCSVAndInsertIntoDB = async (csvData, adminId, req, res) => {
  const results = [];
  const readableStream = Readable.from(csvData);

  let validationError = false;

  return new Promise(async (resolve, reject) => {
    try {
      const userData = await User.findOne({ _id: adminId });
      console.log("userData", userData);
      if (!userData) {
        throw new Error("User not found for the given adminId.");
      }

      readableStream
        .pipe(csv())
        .on("data", (data) => {
          if (!adminValidation.isValidEmployerName(data.employerName)) {
            validationError = true;
            return res.status(400).json({
              error:
                "Invalid employerName. Please use letters, spaces, periods only.",
            });
          } else if (!adminValidation.isValidJobTitle(data.jobTitle)) {
            validationError = true;
            return res.status(400).json({
              error:
                "Invalid jobTitle. Please use letters, spaces, periods only.",
            });
          } else if (
            !adminValidation.isValidJobDescription(data.jobDescription)
          ) {
            validationError = true;
            return res.status(400).json({
              error:
                "Invalid JobDescription. Please use letters and special characters only.",
            });
          } else if (!adminValidation.isValidSalaryRange(data.salaryRange)) {
            validationError = true;
            return res.status(400).json({
              error:
                "Invalid SalaryRange. Please give numbers, Hyphen, and spaces only",
            });
            // }else if (!adminValidation.isValidApplicationDeadline(data.applicationDeadline)) {
            //   validationError = true;
            //   return res.status(400).json({
            //     error:
            //       "Invalid Application Deadline. Please give the future date upto three months",
            //   });
          } else {
            const adminObject = {
              object_id: adminId,
              companyName: userData.companyName,
            };
            data.admin = adminObject;
            results.push(data);
          }
        })
        .on("end", async () => {
          if (validationError) {
            const csvFilePath = `CSV/${req.file.filename}`;
            fs.unlink(csvFilePath, (err) => {
              if (err) {
                console.error("Error deleting CSV file:", err);
              } else {
                console.log("CSV file deleted.");
              }
            });
          } else {
            try {
              const docs = await Admin.insertMany(results);
              const csvFilePath = `CSV/${req.file.filename}`;
              fs.unlink(csvFilePath, (err) => {
                if (err) {
                  console.error("Error deleting CSV file:", err);
                } else {
                  console.log("CSV file deleted.");
                }
              });
              res.status(201).json({
                message: "File uploaded and data inserted into the database.",
              });
              resolve();
            } catch (err) {
              console.error(err);
              reject(err);
            }
          }
        });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

const getJobPostingByAdminId = async (req, res) => {
  try {
    const adminId = req.params.id;
    let query = { "admin.object_id": adminId };
    if (req.query.title) {
      const title = req.query.title;
      const regex = new RegExp(title, "i");
      query.jobTitle = { $regex: regex };
      req.query.page = 1;
    }

    if (req.query.status) {
      query.jobStatus = req.query.status;
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 6;
    const skip = (page - 1) * perPage;

    const sort = { createdAt: -1 };

    const jobPostings = await Admin.find(query)
      .skip(skip)
      .limit(perPage)
      .sort(sort)
      .populate("admin.object_id", "username email");

    const totalJobPostings = await Admin.countDocuments(query);

    const totalPages = Math.ceil(totalJobPostings / perPage);

    return res.json({
      jobPostings,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllJobPostings = async (req, res) => {
  try {
    const currentDate = new Date();
    let query = {
      $and: [
        { jobStatus: "active" },
        { applicationDeadline: { $gt: currentDate } },
      ],
    };

    if (req.query.title) {
      const searchTerm = req.query.title;
      const regex = new RegExp(searchTerm, "i");
      query.$and.push({
        $or: [
          { jobTitle: { $regex: regex } },
          { "admin.companyName": { $regex: regex } },
        ],
      });
    }

    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 8;
    const skip = (page - 1) * perPage;

    const sort = { createdAt: -1 };

    const jobPostings = await Admin.find(query)
      .skip(skip)
      .sort(sort)
      .limit(perPage);

    const totalJobPostings = await Admin.countDocuments(query);

    const totalPages = Math.ceil(totalJobPostings / perPage);

    return res.json({
      jobPostings,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//PUT METHOD FOR JOBPOSTING
// const updateJobPostingById = async (req, res) => {
//   try {
//     const UpdateJob = await Admin.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!UpdateJob) {
//       return res.status(404).json({ error: "Job info not found" });
//     }
//     res.json(UpdateJob);
//   } catch (error) {
//     console.error("Error updating Job info:", error);
//     res.status(500).json({ error: "Unable to update Job info" });
//   }
// };

const updateJobPostingById = async (req, res) => {
  try {
    const updatedStatus = req.body.jobStatus;

    if (updatedStatus === "inactive") {
      const jobApplications = await Application.find({
        "job_id.object_id": req.params.id,
        status: "Reviewing",
      });

      const updatePromises = jobApplications.map(async (application) => {
        application.status = "Hiring closed";
        return application.save();
      });

      await Promise.all(updatePromises);
    }

    const updatedJob = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ error: "Job info not found" });
    }

    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating Job info:", error);
    res.status(500).json({ error: "Unable to update Job info" });
  }
};

module.exports = {
  createJobPosting,
  getJobPostingByAdminId,
  getAllJobPostings,
  parseCSVAndInsertIntoDB,
  updateJobPostingById,
};
