const mongoose = require('mongoose');

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
  exitTime: String,
  notes: String,
  userId: String, // 추가: 주차 공간을 등록한 사용자 ID
  carType: String,
  carNumber: String,
  contact: String,
});

const Schema = mongoose.Schema;

const villaSchema = new Schema({
  villaName: { type: String, required: true },
  address: { type: String, required: true },
  spaces: [spaceSchema], // 주차 공간 스키마 사용
  userId: { type: String, required: true }, // 사용자 ID 추가
  qrCodeUrl: { type: String } // qrCodeUrl 필드 추가
}, {
  timestamps: true,
});

const Villa = mongoose.model('Villa', villaSchema);

module.exports = Villa;