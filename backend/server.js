import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from 'cors';
import express from "express";
import { join } from "path";
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Load environment variables
dotenv.config();

// Verify API key is loaded
console.log('GEMINI_API_KEY status:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing');

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const DOMAIN = process.env.DOMAIN || 'sparkshieldenterprises.xyz';

// Initialize Firebase Admin with better error handling
let serviceAccount;
try {
    if (process.env.FIREBASE_CREDENTIALS) {
        console.log('Using Firebase credentials from environment variable');
        const decodedCreds = Buffer.from(process.env.FIREBASE_CREDENTIALS, 'base64').toString();
        try {
            serviceAccount = JSON.parse(decodedCreds);
            // Verify essential fields
            if (!serviceAccount.project_id || !serviceAccount.private_key) {
                throw new Error('Invalid credential format');
            }
            console.log('Firebase credentials parsed successfully');
        } catch (parseError) {
            console.error('Error parsing Firebase credentials:', parseError);
            throw parseError;
        }
    } else {
        console.log('Using local serviceAccountKey.json');
        const rawData = readFileSync(join(__dirname, './serviceAccountKey.json'), 'utf8');
        serviceAccount = JSON.parse(rawData);
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://sparkshield-c499d-default-rtdb.firebaseio.com"
    });
    console.log('Firebase initialized successfully');

} catch (error) {
    console.error('Error loading Firebase credentials:', error);
    throw new Error('Failed to load Firebase credentials');
}

const db = admin.database();

// Middleware

app.use(cors({
    origin: [
        'http://localhost:80',
        'http://localhost:3000',
        'https://sparkshield1.onrender.com',
        'https://sparkshieldenterprises.xyz',
        'https://www.sparkshieldenterprises.xyz'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); // Enable preflight for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.static(join(__dirname, '../public')));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Add after your imports
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Submit quote request
app.post("/submit-quote", async (req, res) => {
    const { name, email, phone, services, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !services || services.length === 0) {
        return res.status(400).json({ 
            error: "Missing required fields" 
        });
    }

    try {
        // Save to Firebase
        const ref = db.ref("quotes");
        const newQuoteRef = ref.push();
        
        const quoteData = {
            name,
            email,
            phone,
            services,
            message,
            timestamp: new Date().toISOString()
        };

        await newQuoteRef.set(quoteData);

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: `New Quote Request from ${name}`,
            html: `
                <h2>New Quote Request Details</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Services Required:</strong></p>
                <ul>
                    ${services.map(service => `<li>${service.replace(/_/g, ' ').toUpperCase()}</li>`).join('')}
                </ul>
                <p><strong>Additional Message:</strong></p>
                <p>${message || 'No additional message provided.'}</p>
                <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            message: "Quote request submitted successfully!" 
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            error: "Error processing quote request" 
        });
    }
});

// Add this after your existing quote route
app.post("/amc-quote", async (req, res) => {
    const { name, email, phone, services, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !services || services.length === 0) {
        return res.status(400).json({ 
            error: "Missing required fields" 
        });
    }

    try {
        // Save to Firebase
        const ref = db.ref("amc-quotes");
        const newQuoteRef = ref.push();
        
        const quoteData = {
            name,
            email,
            phone,
            services,
            message,
            timestamp: new Date().toISOString()
        };

        await newQuoteRef.set(quoteData);

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New AMC Quote Request from ${name}`,
            html: `
                <h2>New AMC Quote Request Details</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Services Required:</strong></p>
                <ul>
                    ${services.map(service => `<li>${service.replace(/_/g, ' ').toUpperCase()}</li>`).join('')}
                </ul>
                <p><strong>Additional Requirements:</strong></p>
                <p>${message || 'No additional requirements provided.'}</p>
                <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            message: "AMC quote request submitted successfully!" 
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            error: "Error processing AMC quote request" 
        });
    }
});

// Get all quotes (optional - for your reference)
app.get("/get-quotes", (req, res) => {
  const ref = db.ref("quotes");
  
  ref.orderByChild("timestamp").once("value")
    .then((snapshot) => {
      const quotes = snapshot.val() || {};
      res.json(quotes);
    })
    .catch((error) => {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ 
        error: "Error fetching quotes" 
      });
    });
});

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        const response = await fetch(`${API_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a fire safety expert. Provide a brief, concise answer (maximum 3 sentences) about: ${message}`
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 100,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('API Response:', errorData);
            throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            const botResponse = data.candidates[0].content.parts[0].text;
            res.json({ response: botResponse });
        } else {
            throw new Error('Invalid response format from Gemini API');
        }

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ 
            error: 'Failed to get response from AI',
            details: error.message 
        });
    }
});

// Serve static files
app.use(express.static(join(__dirname, '../public')));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public/pages/index.html'));
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
});

// Add after your routes
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${process.env.VERCEL_URL || `http://${HOST}:${PORT}`}`);
});