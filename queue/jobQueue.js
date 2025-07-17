import Queue from 'bull';
import dotenv from 'dotenv';

import fetchAndImportJobs from '../jobGetter/jobFetch.js';

dotenv.config();

const jobQueue = new Queue('job-import-queue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

// Optional debug logs
jobQueue.on('ready', () => console.log('Redis connected'));
jobQueue.on('active', (job) => console.log(`Processing job: ${job.id}`));
jobQueue.on('completed', (job) => console.log(`Job ${job.id} completed`));
jobQueue.on('failed', (job, err) =>
  console.error(`Job ${job.id} failed: ${err.message}`)
);

jobQueue.process(async (job) => {
  await fetchAndImportJobs();
});

export default jobQueue;
