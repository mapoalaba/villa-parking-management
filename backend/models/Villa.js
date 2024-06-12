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
});

const Schema = mongoose.Schema;

const villaSchema = new Schema({
  villaName: { type: String, required: true },
  address: { type: String, required: true },
  spaces: { type: Array, required: true },
  userId: { type: String, required: true }, // 사용자 ID 추가
  qrCodeUrl: { type: String } // qrCodeUrl 필드 추가
}, {
  timestamps: true,
});


const Villa = mongoose.model('Villa', villaSchema);

module.exports = Villa;
