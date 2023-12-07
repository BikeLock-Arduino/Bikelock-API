const express = require('express');
const router = express.Router();
const { User } = require('./app'); // Import the User model from the main app file

/** Example with a model named User with 2 fields - name and email
// POST a new user
router.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await User.create({ name, email });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a specific user by ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/

module.exports = router;
