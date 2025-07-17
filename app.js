// app.js
import dotenv from 'dotenv';
import express from 'express';
import cors from "cors";
import './cron/cronJobFetcher.js';
import connectDB from './Db.js';
import jobs from './routes/jobs.js';
import logs from './routes/logs.js';
dotenv.config();
const app = express();
const PORT = 5000;
// // Middleware
app.use(express.json());
app.use(cors())
connectDB();

app.get('/api', (req, res) => {
  return res.status(200).json({
    mes: 'Listen start',
  });
});
app.use('/api/work', jobs);
app.use('/api/logswork', logs);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
