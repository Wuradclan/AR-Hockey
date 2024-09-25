# AR-Hockey
backend server code for the Hockey AR game for authenticating register new user and login and submit score

to run the application use: node server.js

#API command

Register a new user:

POST /api/auth/register

Request Body: { "username": "JohnDoe", "email": "john@example.com", "password": "password123" }

Login a user:

POST /api/auth/login

Request Body: { "email": "john@example.com", "password": "password123" }

Submit a score (Authenticated):

POST /api/scores/submit

Request Body: { "score": 1000 }

Requires JWT token in the header: { "x-auth-token": "your-jwt-token" }

Get leaderboard:

GET /api/scores/leaderboard