// /jobGetter/jobFetch.js
import axios from 'axios';
import xml2js from 'xml2js';
import ImportLog from '../models/importLog.js';
import Job from '../models/job.js';

const parser = new xml2js.Parser();

const JOB_FEED_URLS = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
];

async function fetchAndImportJobs() {
  console.log('call');
  for (const url of JOB_FEED_URLS) {
    try {
      const { data } = await axios.get(url);
      const json = await parser.parseStringPromise(data);
      const items = json.rss.channel[0].item;

      let totalFetched = items.length;
      let newJobs = 0;
      let updatedJobs = 0;
      let failedJobs = [];

      for (const item of items) {
        try {
          const jobData = {
            jobId: item.guid[0]._ || item.guid[0],
            title: item.title[0],
            company: item['job:company'] ? item['job:company'][0] : 'Unknown',
            location: item['job:location'] ? item['job:location'][0] : 'Remote',
            description: item.description[0],
            postedAt: new Date(item.pubDate[0]),
          };

          const existing = await Job.findOne({ jobId: jobData.jobId });
          if (existing) {
            await Job.updateOne({ jobId: jobData.jobId }, jobData);
            updatedJobs++;
          } else {
            await Job.create(jobData);
            newJobs++;
          }
        } catch (err) {
          failedJobs.push(
            `Job ID: ${item.guid[0]._ || item.guid[0]} - Reason: ${err.message}`
          );
        }
      }

      await ImportLog.create({
        fileName: url,
        timestamp: new Date(),
        totalFetched,
        totalImported: newJobs + updatedJobs,
        newJobs,
        updatedJobs,
        failedJobs,
      });

      console.log(
        `  [${new Date().toLocaleTimeString()}] Imported from ${url}`
      );
      console.log(
        `    Total: ${totalFetched}, New: ${newJobs}, Updated: ${updatedJobs}, Failed: ${failedJobs.length}`
      );
    } catch (err) {
      console.error(` Failed to fetch from ${url}:`, err.message);
    }
  }
}

export default fetchAndImportJobs;
