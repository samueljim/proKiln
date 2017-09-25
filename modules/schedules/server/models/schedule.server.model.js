'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
    default: '',
    trim: true,
    required: 'Title cannot be blank'
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
        type: Number,
        default: 0,
        min: 0
      },
      y: {
        type: Number,
        default: 0
      }
    }
  ]
});

// var Points  = mongoose.model('Points', pointsSchema);


mongoose.model('Schedule', ScheduleSchema);
