const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Static credential check
    if (username !== 'parth' || password !== '260793') {
      return res.status(401).json({ message: 'Invalid credentials. Only authorized user can login.' });
    }
    
    let admin = await Admin.findOne({ username: 'parth' });
    
    // Ensure admin exists in DB so we have an ID for the token
    if (!admin) {
        admin = await Admin.create({ username: 'parth', password: '260793' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '1d' });
    res.json({ token, admin: { id: admin._id, username: admin.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
