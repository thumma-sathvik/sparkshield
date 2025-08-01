🚒 SparkShield – Fire Safety Web App
SparkShield is a modern fire safety solutions platform that enables users to request quotes, manage Annual Maintenance Contracts (AMCs), and access instant fire safety advice through an AI-powered chatbot. Designed with both functionality and scalability in mind, SparkShield helps streamline fire safety management for individuals and organizations.

✨ Key Features
🔥 Quote Request System
Submit detailed requests for refilling, maintenance, and other fire safety services.

🔧 AMC Management
Easily track and manage your Annual Maintenance Contracts in one place.

🤖 AI Chatbot (Gemini AI)
Get instant, accurate responses to fire safety queries via integrated Gemini API.

🔐 Firebase Integration
Securely store and retrieve service requests using Firebase Realtime Database.

📧 Email Notifications
Automated alerts sent to admins and users for new quote submissions using Nodemailer.

🛠️ Tech Stack
Layer	Technology
Backend	Node.js, Express.js
Database	Firebase Realtime Database
Frontend	HTML, CSS, JS (served statically)
AI	Gemini API
Email	Nodemailer (Gmail SMTP)

🚀 Getting Started
Follow the steps below to run SparkShield locally:

1. Clone the Repository
bash
Copy
Edit
git clone <your-repo-url>
cd backup
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment Variables
Create a .env file inside the backend/ directory with the following:

ini
Copy
Edit
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
GEMINI_API_KEY=your-gemini-api-key
Note: Never expose credentials in public repositories.

4. Start the Server
bash
Copy
Edit
node backend/server.js
5. Open in Browser
Visit: http://localhost:3000

📁 Folder Structure
arduino
Copy
Edit
backup/
│
├── backend/
│   ├── server.js
│   ├── connect.js
│   └── ... (other backend files)
│
├── public/
│   ├── index.html
│   ├── pages/
│   └── assets/
│
├── .gitignore
└── README.md
🔐 Security Notice
Ensure .env, Firebase secrets, and other credentials are listed in .gitignore.

Never commit sensitive keys to version control.

