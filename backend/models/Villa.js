const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const spaceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  left: {
    type: Number,
    required: true,
  },
  top: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  exitTime: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  vehicleName: {
    type: String,
    default: '',
  },
  vehicleNumber: {
    type: String,
    default: '',
  },
  contact: {
    type: String,
    default: '',
  }
});

const villaSchema = new Schema({
  villaName: { type: String, required: true },
  address: { type: String, required: true },
  spaces: [spaceSchema],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Multiple users
  qrCodeUrl: { type: String }, // qrCodeUrl 필드 추가
  villaId: { type: String, required: true, unique: true } // villaId 필드 추가
}, {
  timestamps: true,
});

const Villa = mongoose.model('Villa', villaSchema);

module.exports = Villa;