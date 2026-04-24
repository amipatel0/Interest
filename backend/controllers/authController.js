const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    let admin = await Admin.findOne({ username, password });
    
    // Fallback seed
    if (!admin && username === 'parth' && password === '260793') {
        admin = await Admin.create({ username: 'parth', password: '260793' });
    }

    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '1d' });
    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
