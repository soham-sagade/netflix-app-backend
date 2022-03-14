const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken(req, res, next) {
    let authToken = req.headers.authorization || req.headers.token;
    if (authToken) {
      let token = authToken.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(401).send("Need to authenticate!");
        }
        req.user = user;
      });
    } else {
      res.status(401).send("Need to login or register first!");
    }
    next();
  },
};
