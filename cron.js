import cron from "cron";
import Firebase from "./modules/firebase.module.js";
import 'dotenv/config';

const firebase = new Firebase();

// * * * * *
// | | | | |
// | | | | +--- Day of the week (0 - 7) (Sunday is 0 or 7)
// | | | +----- Month (1 - 12)
// | | +------- Day of the month (1 - 31)
// | +--------- Hour (0 - 23)
// +----------- Minute (0 - 59)

// Run every minute
const runTime = "*/5 * * * * *";

// Run every day at 00:00
const runAtMonthBegin = "0 0 1 * *";

const job = new cron.CronJob(runTime, () => {
    const data = { userId: 'abc', randomInt: Math.floor(Math.random() * 100) + 1 };
    firebase.writeToFirebase('cron-test', data)
});
job.start();