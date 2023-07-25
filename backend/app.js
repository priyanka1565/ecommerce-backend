const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

//const path = require("path");
// import middle ware 
const errorMiddleware = require("./midddleware/error");
const path = require("path");
//const cors = require("cors");

//app.use(cors());
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// import all route here
const product = require("./routes/productrouter");
const user = require("./routes/userroute");
const order = require("./routes/orderRoute");
const payment = require("./routes/Paymentroute");

// use all route here 
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

app.use(errorMiddleware);

module.exports = app;

// export this app in server.js
