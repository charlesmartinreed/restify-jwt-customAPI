const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const rjwt = require("restify-jwt-community");

const server = restify.createServer();

// Middleware
// Restify
server.use(restify.plugins.bodyParser());

// Protecc unless it's the auth endpoint
// server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ["/auth"] }));

server.listen(config.PORT, () => {
  // connect to mongoDB through mongoose
  mongoose.set("useFindAndModify", false);
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true }
  );
});

// use the DB that mongoose connected to with mongoose.connect()
const db = mongoose.connection;
db.on("error", err => console.log(err));
db.once("open", () => {
  // once the DB is open, we can create our various restify routes

  // pass server instance to our customers module
  require("./routes/customers")(server);
  require("./routes/users")(server);
  console.log(`Server started on port ${config.PORT}`);
});
