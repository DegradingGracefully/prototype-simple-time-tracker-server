let mongoose = require("mongoose");
let taskSchema = mongoose.Schema({
    /*
    * id
	* title
	* duration
	* enabled (boolean)
	* category (string)
    */
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  enabled: {
    type: Boolean,
    required: true
  },
  category: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now()
  }
});
var Task = mongoose.model("Task", taskSchema);
module.exports = Task;