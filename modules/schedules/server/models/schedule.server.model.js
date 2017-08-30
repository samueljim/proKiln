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
  values: [
    {
      x: {
        type: Number,
        min: 0
      },
      y: {
        type: Number
      }
    }
  ]
});

// var Points  = mongoose.model('Points', pointsSchema);


mongoose.model('Schedule', ScheduleSchema);
