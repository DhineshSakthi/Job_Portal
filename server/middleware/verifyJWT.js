// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   const token = req.cookies.token; 
//   console.log(req.cookies)
//   console.log("token", token)

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     console.log(err)
//     if (err) {
//       return res.status(403).json({ message: "Unauthorized - Invalid token" });
//     }

//     req.user = user;
//     next();
//   });
// }

// module.exports = auth;

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ errorMessage: "Unauthorized - No token provided" });
  }

  if (token) {
    const availableToken = token.split(" ")[1].replace(/"/g, "");
    //console.log(availableToken)
    let payload = jwt.decode(availableToken)
    //console.log("payload",payload)
    jwt.verify(availableToken, process.env.JWT_SECRET, (err, user) => {
     console.log(err)
      if (err) {
        return res
          .status(403)
          .json({ errorMessage: "Unauthorized - Invalid token" });
      }
      req.user = user;
      next();
    });
  }
};

module.exports = auth;

