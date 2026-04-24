const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    paid_amount: { type: Number, required: true },
    remaining_amount: { type: Number, required: true },
    payment_date: { type: String, required: true }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

paymentSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

module.exports = mongoose.model('Payment', paymentSchema);
