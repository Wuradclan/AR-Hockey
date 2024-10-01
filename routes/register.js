// Import necessary modules
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User.js');
const admin = require('firebase-admin');
const router = express.Router();

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      return res.status(401).json({ msg: 'Unauthorized, no token provided' });
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = decodedToken; // Add decoded token (user info) to request object
      next();
    } catch (error) {
      return res.status(401).json({ msg: 'Unauthorized, invalid token', error });
    }
};

// Route to register a new user (after Firebase Authentication)
router.post(
  '/register',
  verifyToken,
  // Validation middleware
  [
    body('username', 'Username is required').not().isEmpty(),
    body('email', 'Please provide a valid email').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email } = req.body;
    const firebaseUid = req.user.uid; // Get Firebase UID from the verified token

    try {
      // Check if the user already exists
      let user = await User.findOne({ firebaseUid });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Create a new user in MongoDB
      user = new User({
        firebaseUid, // Firebase UID to link the user
        username,
        email
      });

      await user.save();
      res.json({ msg: 'User registered successfully', user });

    } catch (error) {
      res.status(500).json({ msg: 'Server error', error });
    }
  }
);

module.exports = router;
