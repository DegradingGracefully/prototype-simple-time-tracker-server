let mongoose = require("mongoose");
const currentTaskTracking = require("../models/currentTaskTracking");

exports.getUniqueTaskTracking = async (req, res) => {
  try {
    let currentTaskTrackings = await currentTaskTracking.findOne({});
    res.status(200).json(currentTaskTrackings);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addCurrentTaskTracking = async (req, res) => {
  try {
    const newCurrentTaskTracking = new currentTaskTracking({
      isTracking: false,
      taskId: "0",
      timeBegin: Date.now()
    });
    let newCurrentTaskTrackinResult = await newCurrentTaskTracking.save();
    res.status(200).json({ data: newCurrentTaskTrackinResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteCurrentTaskTracking = async (req, res) => {
  try {
    let result = await currentTaskTracking.remove({}); // remove all (there is just one ... unique)
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateCurrentTaskTracking  = async (req, res) => {
  try {
    console.log("PUT http://localhost:4000/currentTaskTracking HTTP/1.1...");
    let result = await currentTaskTracking.updateOne({}, req.body); // update all (there is just one ... unique)
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};