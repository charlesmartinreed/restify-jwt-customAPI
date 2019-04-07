const errors = require("restify-errors");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
};
