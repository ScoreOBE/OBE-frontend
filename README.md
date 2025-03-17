# ScoreOBE+ Frontend

ScoreOBE+ is a web-based information management system designed for outcome-based education. It facilitates score management, analysis, and publication for instructors and students.

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository-url.git
   cd scoreobe-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

### Development Mode

Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000` (or another port if specified).

### Production Build

Build the application for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

1. Create a new `.env` file:
   ```bash
   touch .env
   ```

2. Add the following content to `.env`:
   ```ini
   DATABASE_URL=postgres://user:password@localhost:5432/scoreobe
   PORT=3000
   JWT_SECRET=your-secret-key
   ```

## Copyright
© 2025 Computer Engineering, Chiang Mai University. All rights reserved.

