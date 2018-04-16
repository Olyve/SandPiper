const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransferSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  source: { 
    type: String,
    enum: ['apple', 'spotify'],
    required: true 
  },
  target: { 
    type: String,
    enum: ['apple', 'spotify'],
    required: true 
  },
  playlist_name: { 
    type: String,
    min: [1, 'Playlist name is too short'],
    required: true 
  },
  tracks: {
    type: [{type: String}],
    required: true
  },
  status: { 
    type: String,
    enum: ['queued', 'pending', 'completed', 'failed'],
    required: true
  }
});

TransferSchema.pre('save', function(next) {
  let now = new Date();
  this.updatedAt = now;

  if (!this.createdAt) {
    this.createdAt = now;
    this.status = 'queued';
  }
  next();
});

module.exports = mongoose.model('Transfer', TransferSchema);