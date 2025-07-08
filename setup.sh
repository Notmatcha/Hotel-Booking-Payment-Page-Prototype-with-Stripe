#!/bin/bash

echo "Setting up hotel-booking-stripe-demo project..."

# Check for Node.js and npm
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install it first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install it first."
    exit 1
fi

# Set up backend
echo "Creating backend/ and installing dependencies..."
mkdir -p backend
cd backend

# Create package.json if it doesn't exist
if [ ! -f package.json ]; then
    echo "Initializing package.json..."
    npm init -y
fi

echo "Installing backend packages: express, stripe, cors, dotenv..."
npm install express stripe cors dotenv

cd ..

# Confirm frontend exists
echo "Checking frontend/..."
mkdir -p frontend

# Remind user to set up .env
if [ ! -f backend/.env ]; then
    echo "Don't forget to create your backend/.env file with:"
    echo "STRIPE_SECRET_KEY=sk_test_..."
    echo ""
fi

# Suggest how to run
echo "Setup complete!"
echo ""
echo "To start the backend server:"
echo "  cd backend && node server.js"
echo ""
echo "To open the payment page:"
echo "  Open frontend/index.html in your browser"
