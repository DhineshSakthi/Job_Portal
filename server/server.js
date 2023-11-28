require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
//app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors());

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
        title: "Job Portal App",
        version: "0.1.0",
        description: "API documentation for the Job portal App",
    },
    servers: [
      {
        url: "http://localhost:3500/",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spacs = swaggerjsdoc(options);
app.use("/api-docs", swaggerui.serve, swaggerui.setup(spacs));

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/profile", require("./routes/profile"));
app.use("/login", require("./routes/login"));
app.use("/admin", require("./routes/admin"));
app.use("/application", require("./routes/application"));
app.use("/skills", require("./routes/skills"));
app.use("/fields", require("./routes/field"));
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

// app.use(verifyJWT);
//app.use('/users', require('./routes/api/users'));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
