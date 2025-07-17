import express from 'express';
import Job from '../models/job.js';
const routes = express.Router();

routes.get('/job', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find().sort({ postedAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: jobs,
    });
  } catch (err) {
    console.error('❌ Failed to fetch jobs:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default routes;
