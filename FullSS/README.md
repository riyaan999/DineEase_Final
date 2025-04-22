# DineEase - Restaurant Reservation System

## Overview
DineEase is a modern restaurant reservation platform that streamlines the dining experience by providing an intuitive interface for customers to book tables at their favorite restaurants. Built with a focus on user experience and efficiency, DineEase helps restaurants manage their bookings while offering customers a seamless reservation process.

## Features
- User-friendly restaurant reservation interface
- Real-time availability checking
- User account management
- Restaurant information and menu viewing
- Booking management system
- Terms of service and privacy policy integration

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
  - Responsive design with Bootstrap
  - Interactive UI components
- **Backend**: Node.js with Express
  - RESTful API architecture
  - JWT authentication
- **Database**: MongoDB
  - Mongoose ODM for data modeling
  - Efficient data querying

## Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.3.1",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "cookie-parser": "^1.4.6"
}
```

## Setup Instructions
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
- Access the application through your web browser
- Create an account or log in
- Browse restaurants and check availability
- Make reservations by selecting date, time, and party size
- Manage your bookings through the user dashboard

## License
© 2025 DineEase. All rights reserved.
