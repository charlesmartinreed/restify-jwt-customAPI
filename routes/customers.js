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
      return next(new errors.InvalidContentError(err));
    }
  });

  // GET SINGLE CUSTOMER
  server.get("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id of ${req.params.id}`
        )
      );
    }
  });

  // ADD CUSTOMER
  server.post("/customers", async (req, res, next) => {
    // make sure the content type is application/json
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    // create new customer
    const { name, email, balance } = req.body;

    const customer = new Customer({
      name,
      email,
      balance
    });

    try {
      const newCustomer = await customer.save();
      res.send(201); //everything OK, asset was created
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  // UPDATE CUSTOMER
  server.put("/customers/:id", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    try {
      const customer = await Customer.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.send(200);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id of ${req.params.id}`
        )
      );
    }
  });

  // DELETE CUSTOMER
  // notice that with restify, we use del NOT delete
  server.del("/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findOneAndRemove({ _id: req.params.id });
      res.send(204); // means something was successfully removed
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with the id of ${req.params.id}`
        )
      );
    }
  });
};
