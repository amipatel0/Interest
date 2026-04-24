const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photo: { type: String },
    phone: { type: String },
    address: { type: String },
    amount: { type: Number, required: true },
    interest_rate: { type: Number, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String },
    duration: { type: Number },
    payment_method: { type: String, default: 'Cash' },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

customerSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

module.exports = mongoose.model('Customer', customerSchema);
