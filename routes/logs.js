import express from 'express';
import ImportLog from '../models/importLog.js';
const routes = express.Router();

routes.get('/logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ImportLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ImportLog.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: logs.map((log) => ({
        timestamp: log.timestamp,
        fileName: log.fileName,
        totalFetched: log.totalFetched,
        totalImported: log.totalImported,
        newJobs: log.newJobs,
        updatedJobs: log.updatedJobs,
        failedCount: log.failedJobs.length,
        failedJobs: log.failedJobs,
      })),
    });
  } catch (err) {
    console.error('❌ Failed to fetch import logs:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default routes;
