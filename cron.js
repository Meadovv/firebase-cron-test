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

// Run every five seconds
const runTime = "*/5 * * * * *";

// Run every day at 00:00
const runEveryDay  = "0 0 * * *";

const job = new cron.CronJob(runTime, async () => {
    const data = [];
    const expenseGroups = await firebase.readFromFirebase('expenseGroup', ['children', 'users']);
    for (const group of expenseGroups) {
        const children = await firebase.readFromDoc(group.ref, 'children');
        for (const child of children) {
            const users = await firebase.readFromDoc(child.ref, 'users');
            for (const user of users) {
                data.push({
                    name: child.data().name,
                    cycle: child.data().cycle,
                    groupRef: child.ref,
                    ...user.data(),
                })
            }
        }
    }

    for (const item of data) {
        const currentDate = new Date();
        const dueDate = item.due.toDate();
        // if(!(dueDate.getDate() === currentDate.getDate() && item.cycle === 1))
        if(!(item.cycle === 1)) {
            continue;
        }
        const expense = {
            userId: item.userId,
            name: `${item.name} Tháng ${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
            value: item.costByCycle || 0,
            date: currentDate,
            group: item.groupRef,
            note: "Auto generated",
            type: 4
        };
        await firebase.writeToFirebase('expense-test', expense);
    }

});
job.start();