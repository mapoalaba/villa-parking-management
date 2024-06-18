const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const spaceSchema = new mongoose.Schema({
  type: { type: String, required: true },
  left: { type: Number, required: true },
  top: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  isOccupied: { type: Boolean, default: false },
  exitTime: { type: Date, default: null },
  notes: { type: String, default: '' },
  vehicleName: { type: String, default: '' },
  vehicleNumber: { type: String, default: '' },
  phone: { type: String, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null }
});

const villaSchema = new Schema({
  villaName: { type: String, required: true },
  address: { type: String, required: true },
  spaces: [spaceSchema],
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  qrCodeUrl: { type: String }, // qrCodeUrl 필드 추가
  villaId: { type: String, required: true, unique: true }, // villaId 필드 추가
  residents: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 빌라에 거주하는 사용자들
}, {
  timestamps: true,
});

const Villa = mongoose.model('Villa', villaSchema);

module.exports = Villa;