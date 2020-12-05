let mongoose = require("mongoose");
let currentTaskTrackingSchema = mongoose.Schema({
  unique: {
    type: String,
    required: true,
  },
  task_id: {
    // no => can't store the "tasks" object _id in this field, because we put the value 0 when no
    // current Task selected!
    // type: mongoose.Types.ObjectId,
    // ref: 'Tasks',
    //https://stackoverflow.com/questions/26008555/foreign-key-mongoose
    type: String,
    required: true
  },
  timeBegin: {
    type: Date,
    required: true
  }
});

var currentTaskTracking = mongoose.model("currentTaskTracking", currentTaskTrackingSchema);

var funcCheckUniqueDocumentOrCreate = async function() {
  var resultSave;

  console.log("Setting up app => searching for the unique currentTaskTracking in database...");

  const resultFind = await currentTaskTracking.find({}).exec((error, data) => {
    if (error) return console.error(error);
    return data;
  });
  console.log("Find() result: " + resultFind);

  if (resultFind == undefined) {
    console.log("currentTaskTracking document doesn't exist => creating it...");
    const uniqueCurrentTaskTracking = new currentTaskTracking({
      unique: "unique",
      task_id: "0",
      timeBegin: Date.now()
    });
    resultSave = await uniqueCurrentTaskTracking.save((error, data) => {
    if (error) return console.error(error);
    return data;
    });
  }
  console.log("Save() result: " + resultSave);
  return resultSave;
}

funcCheckUniqueDocumentOrCreate();

var funcFindAll = async function() {
  console.log("Find all currentTaskTracking in collection...");

  const resultFind = await currentTaskTracking.find({}).exec((error, data) => {
    if (error) return console.error(error);
    console.log("Result: " + data);
  });
}

funcFindAll();

module.exports = currentTaskTracking;