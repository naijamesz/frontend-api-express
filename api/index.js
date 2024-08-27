import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';

dotenv.config();

const API_URL = 'https://v6.exchangerate-api.com/v6/';
const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// const corsOptions = {
//   origin: ['http://localhost:5173'],
// };
//! Middlewares
app.use(express.json()); // Pass incoming json data
app.use(apiLimiter);
// app.use(cors(corsOptions));
app.use(cors());

//! Conversion
app.post('/api/convert', async (req, res) => {
  try {
    // get the user data
    const { from, to, amount } = req.body;
    console.log({ from, to, amount });
    //Construct the api
    const url = `${API_URL}/${API_KEY}/pair/${from}/${to}/${amount}`;
    const response = await axios.get(url);
    if (response.data && response.data.result === 'success') {
      res.json({
        base: from,
        target: to,
        conversionRate: response.data.conversion_rate,
        convertedAmount: response.data.conversion_result,
      });
    } else {
      res.json({
        message: 'Error converting currency',
        details: response.data,
      });
    }
  } catch (error) {
    res.json({ message: 'Error converting currency', details: error.message });
  }
});
//! Start the server
app.listen(PORT, console.log(`Server is running on PORT ${PORT}...`));
