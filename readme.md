backend
npm install express mongoose cors dotenv jsonwebtoken bcryptjs stripe cors nodemailer otplib npm install express-rate-limit helmet
npm i
npm start

frontend
npm install react-scripts@5.0.1 axios @stripe/stripe-js 
npm install axios react-router-dom
npm install @stripe/react-stripe-js @stripe/stripe-js

For security purpose
prevent sql injection
prevent man in the middle attacks via https (not turned on due to dev)
prevent brute force via rate limit and hashing
prevent spam account via 2fa(not proper due to dev)
prevent stealing of accnts via tokens