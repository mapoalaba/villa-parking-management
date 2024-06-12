const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    vehicleName: { type: String, required: true },
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
