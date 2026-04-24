const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const InterestCalculation = require('../models/InterestCalculation');
const PDFDocument = require('pdfkit');

exports.addCustomer = async (req, res) => {
    try {
        const { amount, interest_rate, duration } = req.body;
        const monthly_interest = (parseFloat(amount) * parseFloat(interest_rate)) / 100;
        const yearly_interest = monthly_interest * 12;
        const total_interest = monthly_interest * parseInt(duration || 0);
        const total_amount = parseFloat(amount) + total_interest;

        const customer = await Customer.create(req.body);

        const calc = await InterestCalculation.create({
            customer_id: customer._id,
            monthly_interest,
            yearly_interest,
            total_amount
        });
        
        const customerData = customer.toJSON();
        customerData.interest_calculation = calc;

        res.status(201).json(customerData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        // Since frontend expects customer and no deep calculations directly mapped on the list layout unless required
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomerStats = async (req, res) => {
    try {
        const customers = await Customer.find().lean();
        const calculations = await InterestCalculation.find().lean();
        
        let totalCustomers = customers.length;
        let totalAmountGiven = 0;
        let totalInterestExpected = 0;

        customers.forEach(c => {
            const principal = parseFloat(c.amount || 0);
            totalAmountGiven += principal;
            
            const calc = calculations.find(cal => cal.customer_id.toString() === c._id.toString());
            if (calc) {
                 const payable = parseFloat(calc.total_amount || 0);
                 const interestMargin = payable - principal;
                 if (interestMargin > 0) {
                     totalInterestExpected += interestMargin;
                 }
            }
        });

        res.json({ totalCustomers, totalAmountGiven, totalInterestExpected });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).lean();
        if (!customer) return res.status(404).json({ message: 'Not found' });
        
        const interest = await InterestCalculation.findOne({ customer_id: customer._id });
        const payments = await Payment.find({ customer_id: customer._id });
        
        customer.id = customer._id.toString();
        customer.interest_calculation = interest;
        customer.payments = payments.map(p => {
            p.id = p._id.toString();
            return p;
        });

        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { amount, interest_rate, duration, ...otherData } = req.body;
        
        // Find existing customer
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Not found' });

        // Update basic fields
        Object.assign(customer, otherData);

        // If financial metrics changed, forcefully recalculate everything
        if (amount !== undefined) customer.amount = amount;
        if (interest_rate !== undefined) customer.interest_rate = interest_rate;
        if (duration !== undefined) customer.duration = duration;

        const newMonthly = (parseFloat(customer.amount || 0) * parseFloat(customer.interest_rate || 0)) / 100;
        const newYearly = newMonthly * 12;
        const newTotalInterest = newMonthly * parseInt(customer.duration || 0);
        const newTotalAmount = parseFloat(customer.amount || 0) + newTotalInterest;

        // Save customer
        await customer.save();

        // Save InterestCalculation bounds securely
        await InterestCalculation.findOneAndUpdate(
            { customer_id: req.params.id }, 
            { 
                monthly_interest: newMonthly, 
                yearly_interest: newYearly, 
                total_amount: newTotalAmount 
            }, 
            { upsert: true }
        );

        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if(!customer) return res.status(404).json({ message: 'Not found' });
        
        // Cascade delete relations perfectly into MongoDB
        await InterestCalculation.findOneAndDelete({ customer_id: req.params.id });
        await Payment.deleteMany({ customer_id: req.params.id });

        res.json({ message: 'Customer completely deleted', success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if(!customer) return res.status(404).json({ message: 'Not found' });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.generatePDF = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).lean();
        if (!customer) return res.status(404).json({ message: 'Not found' });
        
        const interest = await InterestCalculation.findOne({ customer_id: customer._id });

        const doc = new PDFDocument({ margin: 50 });
        const filename = `Statement_${customer._id}_${Date.now()}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        doc.fontSize(24).text('Customer Account Statement', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(14).text(`Name: ${customer.name}`);
        doc.text(`Phone: ${customer.phone || 'N/A'}`);
        doc.text(`Address: ${customer.address || 'N/A'}`);
        doc.moveDown();
        doc.text(`Loan Amount: Rs. ${Number(customer.amount).toLocaleString('en-IN')}`);
        doc.text(`Rate: ${customer.interest_rate}%`);
        doc.text(`Duration: ${customer.duration} months`);
        doc.text(`Start Date: ${customer.start_date ? customer.start_date.split('-').reverse().join('-') : 'N/A'}`);
        doc.text(`End Date: ${customer.end_date ? customer.end_date.split('-').reverse().join('-') : 'N/A'}`);

        if (interest) {
            doc.moveDown();
            doc.text(`Monthly Interest: Rs. ${Number(interest.monthly_interest).toLocaleString('en-IN')}`);
            doc.text(`Yearly Interest: Rs. ${Number(interest.yearly_interest).toLocaleString('en-IN')}`);
            doc.text(`Total Payable Amount: Rs. ${Number(interest.total_amount).toLocaleString('en-IN')}`);
        }
        
        doc.moveDown(2);
        
        const y = doc.y;
        doc.text('_________________________', 50, y);
        doc.text('_________________________', 350, y);
        doc.text('Customer Signature', 50, y + 20);
        doc.text('Admin Signature', 350, y + 20);

        doc.end();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
