const dayjs = require("dayjs");

const weekStartDate = dayjs().day(1).toDate();
const weekEndDate = dayjs().day(7).toDate();

console.log(weekStartDate, weekEndDate);
