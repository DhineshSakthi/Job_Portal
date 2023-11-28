const Application = require("../model/Application");
const Admin = require("../model/Admin");

const checkApplication = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.params.userId;

    const existingApplication = await Application.findOne({
      "job_id.object_id": jobId,
      "user.object_id": userId,
    });

    if (existingApplication) {
      return res.status(200).json({ applied: true });
    } else {
      return res.status(200).json({ applied: false });
    }
  } catch (error) {
    console.error("Error checking application:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const applicationPosting = async (req, res) => {
  try {
    const { job_id, user } = req.body;

    const existingApplication = await Application.findOne({
      $and: [
        { "job_id.object_id": job_id.object_id },
        { "user.object_id": user.object_id },
      ],
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job." });
    }
    const newApplication = new Application(req.body);

    if (req.file) {
      newApplication.resumePath = req.file.path;
    }

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error creating applicationPosting:", error);
    res.status(500).json({ error: "Unable to create applicationPosting" });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.params.id;
    const { page, perPage, startDate, endDate, status } = req.query;

    const perPageInt = parseInt(perPage) || 10;
    const query = { "user.object_id": userId };

    if (status && status !== "all") {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    }

    const totalApplications = await Application.countDocuments(query);

    const totalPages = Math.ceil(totalApplications / perPageInt);
    let pageInt = parseInt(page) || 1;

    if (pageInt < 1 || pageInt > totalPages) {
      pageInt = 1; // Ensure that page is within a valid range
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip((pageInt - 1) * perPageInt)
      .limit(perPageInt)
      .populate({
        path: "job_id.object_id",
        model: "Admin",
        select: "admin.companyName jobTitle jobStatus",
      });

    // Construct the response
    const response = {
      page: pageInt,
      totalPages,
      totalApplications,
      applications,
    };
    return res.json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getJobsAndApplicantsForAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const searchTitle = req.query.title;
    const status = req.query.status;
    const perPage = parseInt(req.query.perPage) || 6;
    let page = parseInt(req.query.page) || 1;

    let jobsQuery = { "admin.object_id": adminId, jobStatus: "active"  };
    if (searchTitle) {
      jobsQuery.jobTitle = { $regex: new RegExp(searchTitle, "i") };
    }

    const jobs = await Admin.find(jobsQuery);

    // if (!jobs || jobs.length === 0) {
    //   return res.status(404).json({ message: "No jobs found for this admin" });
    // }

    const allApplicants = [];

    for (const job of jobs) {
      let applicantsQuery = { "job_id.object_id": job._id };
      if (status && status !== "all") {
        applicantsQuery.status = status;
      }

      const applicants = await Application.find(applicantsQuery);

      const applicantsWithJobTitle = applicants.map((applicant) => ({
        ...applicant.toObject(),
        jobTitle: job.jobTitle,
      }));

      allApplicants.push(...applicantsWithJobTitle);
    }

    allApplicants.sort((a, b) => b.createdAt - a.createdAt);

    const totalApplicants = allApplicants.length;
    const totalPages = Math.ceil(totalApplicants / perPage);

    if (page > totalPages) {
      page = 1; // Ensure that page is within valid range
    }

    const skip = (page - 1) * perPage;
    const paginatedApplicants = allApplicants.slice(skip, skip + perPage);

    return res.json({
      applicants: paginatedApplicants,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateApplicantStatusById = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedApplication = await Application.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { status } },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getApplicationStatistics = async (req, res) => {
  const adminId = req.params.id;
  try {
    const jobs = await Admin.find({ "admin.object_id": adminId,  jobStatus: "active"  });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this admin" });
    }

    let statistics = {
      totalApplicantsToday: 0,
      totalApplicantsReviewing: 0,
      totalApplicantsAcceptedToday: 0,
      totalApplicantsRejectedToday: 0,
      totalApplicantsLastWeek: 0,
      totalApplicantsAcceptedLastWeek: 0,
      totalApplicantsRejectedLastWeek: 0,
      totalApplicantsOnWhole: 0,
      totalApplicantsAcceptedOnWhole: 0,
      totalApplicantsRejectedOnWhole: 0,
    };

    for (const job of jobs) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

      // Applicants today
      const applicantsToday = await Application.countDocuments({
        "job_id.object_id": job._id,
        createdAt: { $gte: today },
      });

      // Applicants reviewing
      const applicantsReviewing = await Application.countDocuments({
        "job_id.object_id": job._id,
        status: "Reviewing",
      });

      // Applicants accepted today
      const applicantsAcceptedToday = await Application.countDocuments({
        "job_id.object_id": job._id,
        createdAt: { $gte: today },
        status: "Accepted",
      });

      // Applicants rejected today
      const applicantsRejectedToday = await Application.countDocuments({
        "job_id.object_id": job._id,
        createdAt: { $gte: today },
        status: "Rejected",
      });

      // Applicants last week
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      const applicantsLastWeek = await Application.countDocuments({
        "job_id.object_id": job._id,
        createdAt: { $gte: lastWeek, $lt: today },
      });

      // Applicants accepted last week
      const applicantsAcceptedLastWeek = await Application.countDocuments({
        "job_id.object_id": job._id,
        createdAt: { $gte: lastWeek, $lt: today },
        status: "Accepted",
      });

      // Applicants rejected last week
      const applicantsRejectedLastWeek = await Application.countDocuments({
        "job_id.object_id": job._id,
        createdAt: { $gte: lastWeek, $lt: today },
        status: "Rejected",
      });

      // Applicants on the whole
      const applicantsOnWhole = await Application.countDocuments({
        "job_id.object_id": job._id,
      });

      // Applicants accepted on the whole
      const applicantsAcceptedOnWhole = await Application.countDocuments({
        "job_id.object_id": job._id,
        status: "Accepted",
      });

      // Applicants rejected on the whole
      const applicantsRejectedOnWhole = await Application.countDocuments({
        "job_id.object_id": job._id,
        status: "Rejected",
      });

      // Update statistics
      statistics.totalApplicantsToday += applicantsToday;
      statistics.totalApplicantsReviewing += applicantsReviewing;
      statistics.totalApplicantsAcceptedToday += applicantsAcceptedToday;
      statistics.totalApplicantsRejectedToday += applicantsRejectedToday;
      statistics.totalApplicantsLastWeek += applicantsLastWeek;
      statistics.totalApplicantsAcceptedLastWeek += applicantsAcceptedLastWeek;
      statistics.totalApplicantsRejectedLastWeek += applicantsRejectedLastWeek;
      statistics.totalApplicantsOnWhole += applicantsOnWhole;
      statistics.totalApplicantsAcceptedOnWhole += applicantsAcceptedOnWhole;
      statistics.totalApplicantsRejectedOnWhole += applicantsRejectedOnWhole;
    }

    // Return all the statistics in one response
    res.json(statistics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  applicationPosting,
  checkApplication,
  getAppliedJobs,
  getApplicationStatistics,
  getJobsAndApplicantsForAdmin,
  updateApplicantStatusById,
};
