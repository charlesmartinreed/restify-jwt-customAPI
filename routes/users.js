const errors = require("restify-errors");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const config = require("../config");

module.exports = server => {
  // REGISTER USER ROUTE
  server.post("/register", (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password
    });

    // takes in a number of rounds, and a callback
    bcrypt.genSalt(10, (err, salt) => {
      // pass in plaintext password, the salt, callback
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // set user password to hashed password
        user.password = hash;

        // attempt to save the user
        try {
          const newUser = await user.save();
          res.send(201); //resource successfully created
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // AUTHENTICATE USER ROUTE
  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;

    try {
      // attempt to authenticate the author
      const user = await auth.authenticate(email, password);

      // create a web token, pass it to the authenticated user
      // pass in the JSONized data, the secret, expiration date
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "15m"
      });

      // respond with issued at, expiration and token from JWT
      const { iat, exp } = jwt.decode(token);
      res.send({ iat, exp, token });

      next();
    } catch (err) {
      // user is not authorized
      return next(new errors.UnauthorizedError(err));
    }
  });
};
