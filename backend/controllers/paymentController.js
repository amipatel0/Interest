const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const InterestCalculation = require('../models/InterestCalculation');

exports.addPayment = async (req, res) => {
    try {
        const { paid_amount, payment_date } = req.body;
        const customerId = req.params.customerId;

        const customer = await Customer.findById(customerId);
        if (!customer) throw new Error('Customer not found');

        const interest = await InterestCalculation.findOne({ customer_id: customerId });
        const existingPayments = await Payment.find({ customer_id: customerId });

        let totalPayable = interest ? parseFloat(interest.total_amount) : 0;
        let previouslyPaid = existingPayments.reduce((sum, p) => sum + parseFloat(p.paid_amount), 0);
        
        let remaining_amount = totalPayable - previouslyPaid - parseFloat(paid_amount);
        if(remaining_amount < 0) remaining_amount = 0;

        const payment = await Payment.create({
            customer_id: customerId,
            paid_amount,
            remaining_amount,
            payment_date
        });
        
        if (remaining_amount <= 0) {
           await Customer.findByIdAndUpdate(customerId, { status: 'paid' });
        } else {
           await Customer.findByIdAndUpdate(customerId, { status: 'pending' });
        }

        res.status(201).json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ customer_id: req.params.customerId });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
