const errors = require("restify-errors");
const Customer = require("../models/Customer");

module.exports = server => {
  // GET CUSTOMERS
  server.get("/customers", async (req, res, next) => {
    try {
      // fetch ALL customers from DB using async/await
      const customers = await Customer.find({});

      res.send(customers);

      // with restify, you always need to call next() when finished with your route
      next();
    } catch (err) {
      return next(new errors.invalidContentError(err));
    }
  });
};
