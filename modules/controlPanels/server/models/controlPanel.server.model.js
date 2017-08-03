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
  return pat.test(v);
}

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
  temp: [{
    data: {
      type: Number,
      default: null,
      // required: 'Temp cannot be blank',
      trim: true,
      patten: '/^\-?\d+(?:\.\d+)?$/',
      messages: {
        patten: 'temp must be a valid number'
      }
    },
    time: {
      type: Date,
      default: Date.now
    }
  }
  ],
  schedule: {
    type: String,
    trim: true,
    default: ''
  },
  scheduleProgress: {
    type: Number,
    trim: true,
    default: '0'
  },
  scheduleStatus: {
    type: String,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('ControlPanel', ControlPanelSchema);
