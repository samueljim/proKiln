'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
* Points of data Schema
*/
var pointsSchema = new Schema({
  temp: {
    type: Number,
    default: null,
    required: 'Temp cannot be blank',
    trim: true,
    patten: '/^\-?\d+(?:\.\d+)?$/',
    messages: {
      patten: 'temp must be a valid number'
    }
  },
  time: {
    type: Number,
    required: 'Time cannot be blank'
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
  data: [{
    type: Schema.Types.ObjectId,
    ref: 'Points'
  }],
  scheduleStatus: {
    type: String,
    trim: true,
    default: 'Not Running'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var Points  = mongoose.model('Points', pointsSchema);


mongoose.model('Schedule', ScheduleSchema);
