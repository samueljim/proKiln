'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
  content: {
    type: String,
    default: '',
    trim: true
  },
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

// time or length ?
// temp
// user


mongoose.model('Schedule', ScheduleSchema);
