const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ISRCMapSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  isrc: {
    type: String,
    required: true
  },
  apple_id: { type: String },
  spotify_id: { type: String }
});

ISRCMapSchema.pre('save', function(next) {
  let now = new Date();
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('ISRCMap', ISRCMapSchema);