const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then((data) => {
        console.log(`mongodb connected with srevr:${data.connection.host}`);
      })
}

module.exports = connectDatabase;

// import this data base into the server.js file 