const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cron = require('node-cron');
const moment = require('moment');

const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/customers/:customerId/payments', paymentRoutes);

cron.schedule('0 9 * * *', async () => {
    console.log(`[Reminder System] Running daily check at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
