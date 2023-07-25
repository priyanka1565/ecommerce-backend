// import app here
const app = require("./app");
const cloudinary = require("cloudinary");
// import dotenv

// import database
const connectDatabase = require("./config/database")

// handle uncaught error 
process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log("shuting down the server deu to uncaughtException error");
    process.exit(1);
})

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}


// call databse
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
 const server = app.listen(process.env.PORT, () => {
    console.log(`server is runnning on http://localhost:${process.env.PORT}`);
});

// handle unhandle promise rejection error 
process.on("unhandleRejection", (err) => {
    console.log(`Error":${err.message}`);
    console.log("shuting down the server deuto unhandle promise error");
    server.close(() => {
        process.exit(1);
    });
});

// step 1 after connecting with database 