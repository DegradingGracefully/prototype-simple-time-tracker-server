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

var checkUniqueDocument = async function(done) {
  var resultSave;

  console.log("Initializing app db => searching for the unique currentTaskTracking in database...");

  /*const resultFind = await currentTaskTracking.find({}).exec().then((data) => {
    return data;
  });*/
  await currentTaskTracking.find({}).exec((error, data) => {
    if (error) return console.error(error);
    
    console.log("Find() result: " + data);
    done(data);
  });
}

  /*resultFind.then(data => {
  console.log("data: " + data);
  if (data == undefined || data == []) {
    console.log("currentTaskTracking document doesn't exist => creating it...");
    const uniqueCurrentTaskTracking = new currentTaskTracking({
      unique: "unique",
      task_id: "0",
      timeBegin: Date.now()
    });
    resultSave = await uniqueCurrentTaskTracking.save();
    console.log("Save() result: " + resultSave);
    // return resultSave;
  } else {
    console.log("Ok app already initialized...");
  }
});*/

function createUniqueDocumentIfNotExist(data) {
  if (data == undefined || !data.length) { // why test data.length ? because I don't know the "proper" or "official" way to test for an emtpy result
  // of the mongoose find() method (supposed to return Document[]) . So thanks rsp @ https://stackoverflow.com/a/45172845
    const uniqueCurrentTaskTracking = new currentTaskTracking({
      unique: "unique",
      task_id: "0",
      timeBegin: Date.now()
    });
    uniqueCurrentTaskTracking.save().then(data => {
      console.log("Save() result: " + data);
    }).catch(error => {
      return console.error(error);
    });
  }
}

checkUniqueDocument(createUniqueDocumentIfNotExist);

// funcFindAll();

module.exports = currentTaskTracking;