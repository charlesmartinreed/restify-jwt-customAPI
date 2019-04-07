const bcrypt = require("bcryptjs"),
  mongoose = require("mongoose"),
  User = mongoose.model("User");

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get the user by email
      const user = await User.findOne({ email });

      // match the password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        // if passwords match, isMatch is true
        if (err) throw err;
        if (isMatch) {
          // resolve
          resolve(user);
        } else {
          // pass not a match
          reject("Authentication failed");
        }
      });
    } catch (err) {
      // if can't find user, reject
      reject("Authentication Failed");
    }
  });
};
