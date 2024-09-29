const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// User login
exports.login = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  let user = await User.findOne({ where: { username } });
  if (!user) {
    user = await User.create({ username });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return res.json({ token });
};
