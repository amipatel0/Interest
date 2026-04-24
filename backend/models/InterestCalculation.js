const mongoose = require('mongoose');

const interestCalculationSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    monthly_interest: { type: Number, required: true },
    yearly_interest: { type: Number, required: true },
    total_amount: { type: Number, required: true }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

interestCalculationSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

module.exports = mongoose.model('InterestCalculation', interestCalculationSchema);
