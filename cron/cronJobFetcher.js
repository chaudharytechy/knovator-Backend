import cron from 'node-cron';
// import jobQueue from "../queues/jobQueue.js";
// import jobQueue from "../queue/jobQueue.js";
import jobQueue from '../queue/jobQueue.js';

cron.schedule('*/30 * * * * *', async () => {
  console.log(
    'Scheduling background import job at',
    new Date().toLocaleTimeString()
  );
  await jobQueue.add(
    { scheduledAt: new Date().toISOString() },
    { attempts: 3, backoff: 5000 }
  );
});
