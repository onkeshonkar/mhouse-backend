const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

/**
 * @summary returns difference in time(HH:mm format 24) in minute/s
 *
 */
const timeDifference = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return 0;
  }

  const timeRegex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  if (!startTime.match(timeRegex) || !endTime.match(timeRegex)) {
    console.log("hello");
    return 0;
  }

  let todaysDate = dayjs().format("YYYY/MM/DD");
  let start = dayjs(todaysDate + ` ${startTime}`);
  let end = dayjs(todaysDate + ` ${endTime}`);

  let diff = end.diff(start);
  let totalMinutes = dayjs.duration(diff).asMinutes();

  return totalMinutes;
};

module.exports = timeDifference;
