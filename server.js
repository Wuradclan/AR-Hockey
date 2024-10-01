// server.js
const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

// Initialize environment variables
dotenv.config();

// Firebase Admin SDK initialization
const serviceAccount = require('./hockey-ar-firebase-adminsdk-v37ef-e7fec455f6.json'); // Replace with your service account path
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: 'https://hockey-ar.firebaseio.com' // Replace with your Firebase project URL # nit needed since we use mongoDB Atlas to store users and scores
});

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware to parse JSON
app.use(express.json());

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

// Routes
//app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/scores', require('./routes/scores.js'));

// Route to register a new user (after Firebase Authentication)
app.use('/api/register', require('./routes/register.js'));


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
