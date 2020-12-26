let mongoose = require("mongoose");
let currentTaskTrackingSchema = mongoose.Schema({
  isTracking: {
    type: Boolean,
    required: true
  },
  taskId: {
    // no => can't store the "tasks" object _id in this field, because we put the value 0 when no
    // current Task selected!
    // type: mongoose.Types.ObjectId,
    // ref: 'Tasks',
    type: String,
    required: true
  },
  timeBeginTracking: {
    type: Date,
    required: true
  }
});

var currentTaskTracking = mongoose.model("currentTaskTracking", currentTaskTrackingSchema);

const ID_NO_TASK_TRACKING = 0; // represents the fact that we're not tracking any task currently

var checkUniqueDocument = async function(done) {
  console.log("Initializing app db => searching for the unique currentTaskTracking in database...");

  await currentTaskTracking.find({}).exec((error, data) => {
    if (error) return console.error(error);
    
    console.log("Find() result: " + data);
    done(data);
  });
}

function createUniqueDocumentIfNotExist(data) {
  if (data == undefined || !data.length) { // why test data.length ? because I don't know the "proper" or "official" way to test for an emtpy result
  // of the mongoose find() method (supposed to return Document[]) . So thanks rsp @ https://stackoverflow.com/a/45172845
    const uniqueCurrentTaskTracking = new currentTaskTracking({
      isTracking: false,
      taskId: "0",
      timeBeginTracking: Date.now()
    });
    uniqueCurrentTaskTracking.save().then(data => {
      console.log("Save() result: " + data);
    }).catch(error => {
      return console.error(error);
    });
  }
}

checkUniqueDocument(createUniqueDocumentIfNotExist);

module.exports = currentTaskTracking;