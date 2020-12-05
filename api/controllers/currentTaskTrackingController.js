let mongoose = require("mongoose");
const currentTaskTracking = require("../models/currentTaskTracking");

exports.allCurrentTaskTracking = async (req, res) => {
  try {
    let currentTaskTrackings = await currentTaskTracking.find({});
    res.status(200).json(currentTaskTrackings);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.addCurrentTaskTracking = async (req, res) => {
  try {
    const newCurrentTaskTracking = new currentTaskTracking({
      unique: "unique",
      task_id: "0",
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
    let result = await currentTaskTracking.remove({ unique: "unique" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateCurrentTaskTracking  = async (req, res) => {
  try {
    let result = await currentTaskTracking.update({ unique: "unique" }, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};