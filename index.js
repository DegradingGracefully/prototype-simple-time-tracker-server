const express = require("express");
const PORT = process.env.PORT || 4017;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config/db");
const app = express();
const task = require("./api/routes/task")
const currentTaskTracking = require("./api/routes/currentTaskTracking")

mongoose.Promise = global.Promise; // ??? https://stackoverflow.com/questions/61188713/node-unhandledpromiserejectionwarning-when-saving-to-mongodb for example..

//configure database and mongoose
mongoose.set("useCreateIndex", true);
mongoose
  .connect(config.database, { useNewUrlParser: true })
  .then(() => {
    console.log("Database is connected");
  })
  .catch(err => {
    console.log({ database_error: err });
  });
// db configuaration ends here
// below configuration necessary ?  https://stackoverflow.com/questions/61188713/node-unhandledpromiserejectionwarning-when-saving-to-mongodb
app.on('unhandledRejection', (reason, promise) => {
  console.log("Reason: ",reason,"promise: ",promise);
})
//registering cors
app.use(cors());
//configure body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//configure body-parser ends here
app.use(morgan("dev")); // configire morgan
// define first route
app.get("/", (req, res) => {
  res.json("Hola Svelte Developers...Shall we fight??");
});
app.use('/task', task)
app.use('/currentTaskTracking', currentTaskTracking)
app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});