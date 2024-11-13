const cron = require('node-cron');
const { updatecurrentDayRewardClaimed } = require('../controllers/member.controller');

const runDailyTask = async () => {
  try {
    await updatecurrentDayRewardClaimed();
    console.log("schedule done")
  } catch (error) {
    console.error('Error running daily task:', error);
  }
};

const scheduleTasks = () => {
  cron.schedule('0 0 * * *', runDailyTask, {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  });
};

module.exports = { scheduleTasks };
