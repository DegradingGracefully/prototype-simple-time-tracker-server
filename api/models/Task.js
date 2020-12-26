const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
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
  trackingByDate: [{
    dateBegin: {
      type: Date,
      required: true
    },
    dateEnd: {
      type: Date,
      required: true
    },
    duration: {
      type: Number
    }
  }],
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
})
const Task = mongoose.model('Task', taskSchema);

const taskTestArray = [
  new Task({
    title: 'test1 trackingByDate field',
    duration: 0,
    trackingByDate: [{
      dateBegin: new Date('2020-12-07T11:45:32'), // TODO => compute duration in seconds
      dateEnd: new Date('2020-12-07T12:33:32'),
    }],
    enabled: true,
  }),
  new Task({
    title: 'test2 trackingByDate field',
    duration: 0,
    trackingByDate: [{
      dateBegin: new Date('2020-12-12T22:22:32'), // TODO => compute duration in seconds
      dateEnd: new Date('2020-12-13T09:12:02'),
    }],
    enabled: true,
  }),
  new Task({
    title: 'test3 task some trackingBydate today 2020/12/19',
    duration: 0,
    trackingByDate: [{
      dateBegin: new Date('2020-12-19T09:22:32'), // TODO => compute duration in seconds
      dateEnd: new Date('2020-12-19T09:44:02'),
    }],
    enabled: true,
  }),
  new Task({
    title: 'test4 got 2 trackingByDate occurences for today 2020/12/19',
    duration: 0,
    trackingByDate: [{
      dateBegin: new Date('2020-12-19T09:22:32'), // TODO => compute duration in seconds
      dateEnd: new Date('2020-12-19T09:44:02'),
    }, {
      dateBegin: new Date('2020-12-19T17:22:32'), // TODO => compute duration in seconds
      dateEnd: new Date('2020-12-19T18:35:02'),
    }],
    enabled: true,
  }),
   new Task({
    title: 'test5 got 2 trackingByDate occurences for today 2020/12/20',
    duration: 0,
    trackingByDate: [{
      dateBegin: new Date('2020-12-20T09:22:32'), // TODO => compute duration in seconds
      dateEnd: new Date('2020-12-20T09:44:02'),
    }, {
      dateBegin: new Date('2020-12-20T17:22:32'), // TODO => compute duration in seconds
      dateEnd: new Date('2020-12-20T18:35:02'),
    }],
    enabled: true,
  })
]

const checkTaskTestExists = async function (testTask, done) {
  console.log('Searching for test Task in database...');

  await Task.find({
    title: testTask.title
  }).exec((error, data) => {
    if (error) return console.error(error);

    console.log(`Find() result: ${data}`);
    done(testTask, data);
  });
}

function createTaskTestIfNotExists(testTask, data) {
  if (data === undefined || !data.length) {
    // creating a test task for playing with the new trackingByDate field
    testTask.save().then((dataSave) => {
      console.log(`Saved new Task result: ${dataSave}`);
    }).catch((error) => console.error(error));
  }
}

function filterGivenTaskForGivenDayDuration() {
  const givenDayBegin = new Date('2020-12-19T00:00:00');
  const givenDayEnd = new Date('2020-12-19T23:59:59');
  /* const givenDayMinus1 = givenDay.getDate() - 1;
  const givenDayPlus1 = givenDay.getDate() + 1; */

  Task.find({
    // title: 'testing trackingByDate field',
    // conditions: dateBegin  falls inside the given day OR dateEnd falls inside the given day
    $or: [{
      $and: [{
        'trackingByDate.dateBegin': {
          $gte: givenDayBegin
        }
      }, {
        'trackingByDate.dateBegin': {
          $lte: givenDayEnd
        }
      }]
    }]
    /*}, {
      $and: [{
        dateEnd: {
          $gte: givenDayBegin
        }
      }, {
        dateEnd: {
          $lte: givenDayEnd
        }
      }]
    }]*/
  }).exec((error, data) => {
    if (error) return console.error(error);

    // compute duration for the current day

    console.log(`filterGivenTaskForGivenDayDuration result: ${data}`);
  });
}

taskTestArray.forEach((testTask) => {
  checkTaskTestExists(testTask, createTaskTestIfNotExists);
});

async function computeAllTaskDurationForToday() {
  const todayDateBegin = new Date('2020-12-19T00:00:00');
  const todayDateEnd = new Date('2020-12-19T23:59:59');

  Task.find({
    // _id: task._id,
    // conditions: dateBegin falls inside the given day
    $and: [{
      'trackingByDate.dateBegin': {
        $gte: todayDateBegin
      }
    }, {
      'trackingByDate.dateBegin': {
        $lte: todayDateEnd
      }
    }]
  }).exec((error, tasks) => {
    if (error) return console.error(error);

    console.log(`computeAllTaskDurationForToday => found ${tasks.length} tasks...`);

    tasks.forEach((task) => {
      console.log(`computeAllTaskDurationForToday => computing duration for task ${task}...`);

      // compute duration for the current day
      //err.. the mongo query gave us the Task object, but it comes with all its trackingByDate.. must refilter here on the current day again ???
      const filter = (trackingByDate) => {
        const today = new Date();

        return trackingByDate.dateBegin.getFullYear() === today.getFullYear() &&
          trackingByDate.dateBegin.getMonth() === today.getMonth() &&
          trackingByDate.dateBegin.getDate() === today.getDate(); // getDate ??? https://stackoverflow.com/questions/43855166/how-to-tell-if-two-dates-are-in-the-same-day
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

      console.log("task.trackingByDate.filter(filter) =>" + task.trackingByDate.filter(filter));
      // const durationForDaySeconds = task.trackingByDate.filter(filter).reduce(reducer);
      const durationForDaySeconds = task.trackingByDate.filter(filter).reduce(reducer, 0);

      console.log(`Total duration for day: ${durationForDaySeconds}`); // undefined? ??
    });
  });
}

computeAllTaskDurationForToday();

module.exports = Task;