'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Validation
 */
function validateIsNumber(v) {
  var patt = /^\-?\d+(?:\.\d+)?$/;
  console.log('' + patt.test(v) + '');
  return patt.test(v);
}


/**
* runsSchema
*/
var runsSchema = new Schema({
  scheduleTitle: {
    type: String,
    default: 'Unamed schedule'
  },
  startTime: {
    type: Date,
    trim: true
  },
  temp: [
    {
      y: {
        type: Number,
        trim: true,
        default: 0
      },
      x: {
        type: Date,
        trim: true,
        default: 0
        // default: Date.now
      }
    }
  ]
}
);
/**
* Points of data Schema
*/
var ProgramSchema = new Schema({
  segment: {
    type: Number
  },
  rate: {
    type: Number
  },
  goal: {
    type: Number
  },
  hold: {
    type: Number
  },
  timeToGoal: {
    type: Number
  },
  firstCumulative: {
    type: Number
  },
  secondCumulative: {
    type: Number
  }
});
/**
 * Schedule Schema
 */
var ScheduleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date
  },
  title: {
    type: String,
    default: 'Select a Schedule',
    trim: true
  },
  content: {
    type: String,
    default: 'No contents',
    trim: true
  },
  program: [ProgramSchema],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  totalTiming: {
    type: Number
  },
  startTemp: {
    type: Number,
    default: 24,
    required: 'No start temperature'
  },
  values: [
    {
      x: {
        type: Date
      },
      y: {
        type: Number,
        default: 0
      }
    }
  ]
});

/**
 * ControlPanel Schema
 */
var ControlPanelSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  info: {
    type: String,
    default: '',
    trim: true
  },
  online: {
    type: Boolean,
    default: false
  },
  runNum: {
    type: Number,
    default: '0'
  },
  runs: [runsSchema],
  schedule: [ScheduleSchema],
  scheduleProgress: {
    type: Number,
    trim: true,
    default: '0'
  },
  scheduleStatus: {
    type: String,
    trim: true
  },
  emailAlerts: {
    type: Boolean,
    default: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('ControlPanel', ControlPanelSchema);
