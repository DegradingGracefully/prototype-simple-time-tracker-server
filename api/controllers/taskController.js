let mongoose = require("mongoose");
const Task = require("../models/Task");

/*
function deepClone(obj, hash = new WeakMap()) {
  if (Object(obj) !== obj) return obj; // primitives
  if (hash.has(obj)) return hash.get(obj); // cyclic reference
  const result = obj instanceof Set ? new Set(obj) // See note about this!
    :
    obj instanceof Map ? new Map(Array.from(obj, ([key, val]) =>
      [key, deepClone(val, hash)])) :
    obj instanceof Date ? new Date(obj) :
    obj instanceof RegExp ? new RegExp(obj.source, obj.flags)
    // ... add here any specific treatment for other classes ...
    // and finally a catch-all:
    :
    obj.constructor ? new obj.constructor() :
    Object.create(null);
  hash.set(obj, result);
  return Object.assign(result, ...Object.keys(obj).map(
    key => ({
      [key]: deepClone(obj[key], hash)
    })));
} */

function computeTaskDurationForToday(task) {
    // let task = deepClone(task);
    const todayDateBegin = new Date('2020-12-19T00:00:00');
    const todayDateEnd = new Date('2020-12-19T23:59:59');

    console.log("------- computeTaskDurationForToday BEGIN -----------> " + task);

    // compute duration for the current day
    //err.. the mongo query gave us the Task object, but it comes with all its trackingByDate.. must refilter here on the current day again ???
    const filter = (trackingByDate) => {
        if (trackingByDate.length === 0) {
            return false;
        } else {
            const today = new Date();
            console.log("filter=>" + trackingByDate);
            // checks if this trackingByDate item falls into today
            return trackingByDate.dateBegin.getFullYear() === today.getFullYear() &&
                trackingByDate.dateBegin.getMonth() === today.getMonth() &&
                trackingByDate.dateBegin.getDate() === today.getDate(); // getDate ??? https://stackoverflow.com/questions/43855166/how-to-tell-if-two-dates-are-in-the-same-day
        }
    };

    const reducer = (accumulator, currentTrackingByDate) => {
        const durationMillis = currentTrackingByDate.dateEnd - currentTrackingByDate.dateBegin;
        const durationSeconds = Math.floor(durationMillis / 1000);
        console.log("============");
        console.log("durationSeconds" + durationSeconds);
        console.log("============");
        console.log("accu" + (accumulator + durationSeconds));
        return accumulator + durationSeconds;
    };

    console.log("taskController task.trackingByDate.filter(filter) =>" + task.trackingByDate.filter(filter));
    // const durationForDaySeconds = task.trackingByDate.filter(filter).reduce(reducer);
    const durationForTodaySeconds = task.trackingByDate.filter(filter).reduce(reducer, 0);
    console.log(`Total duration for day: ${durationForTodaySeconds}`); // undefined? ??

    /* const copyTask = { ...task,
      ["durationForToday"]: durationForTodaySeconds
    }; */
    // https://mongoosejs.com/docs/api.html#document_Document-toObject ?
    // https://stackoverflow.com/questions/48014504/es6-spread-operator-mongoose-result-copy
    const copyTask = { ...task.toObject(),
        ["durationForToday"]: durationForTodaySeconds
    };

    console.log("------- computeTaskDurationForToday END -----------> " + copyTask);
    return copyTask;
}

// this filter returns only recurring tasks and tasks created today
function filter2(task) {
    // checks if this task is recurring
    if (task.isRecurring) {
        return true;
    }
    const today = new Date();

    // checks if this task was created today
    return task.created.getFullYear() === today.getFullYear() &&
        task.created.getMonth() === today.getMonth() &&
        task.created.getDate() === today.getDate();
}

exports.allTask = async (req, res) => {
    Task.find().exec((error, tasks) => {

        if (error) res.status(500).json(err);

        console.log("found all tasks: " + tasks);

        let newTasks = tasks.filter(filter2);
        console.log("filtered tasks =>" + newTasks);

        // compute durations for today
        newTasks = newTasks.map((task) => {
            const newTask = computeTaskDurationForToday(task);
            console.log("computed task=>" + newTask);
            console.log("computed field=>" + newTask.durationForToday);

            return newTask;
        });

        newTasks = newTasks;

        console.log("newTasks = " + newTasks);
        res.status(200).json(newTasks);
    });
};

exports.addTask = async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            duration: req.body.duration,
            enabled: req.body.enabled,
            category: req.body.category
        });
        let newTask = await task.save();
        res.status(200).json({
            data: newTask
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.taskId;
        let result = await Task.findByIdAndRemove(id);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteAllTask = async (req, res) => {
    try {
        let result = await Task.remove({});
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.updateTask = async (req, res) => {
    try {
        const id = req.params.taskId;
        let result = await Task.findByIdAndUpdate(id, req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json(err);
    }
};