const cluster = require("cluster");

const Agenda = require("agenda");
const mongoose = require("mongoose");
const dayjs = require("dayjs");

const Task = require("../models/Task.model");
const TaskCron = require("../models/TaskCron.model");
const config = require("../config");
const logger = require("../utils/logger");

const agenda = new Agenda({
  db: {
    address: config.db,
    collection: "agendaJobs",
  },
  name: "Task schedular",
});

agenda
  .on("ready", () => logger.info("Agenda started!"))
  .on("error", () => logger.warn("Agenda connection error!"));

agenda.define("Add task of the day", async (job, done) => {
  const taskCrons = await TaskCron.find({ repeatType: "Daily" });

  const taskBulkQueries = [];

  taskCrons.map((cronTask) => {
    cronTask.departments.map((dep) => {
      taskBulkQueries.push({
        insertOne: {
          document: {
            department: dep,
            title: cronTask.title,
            comment: cronTask.comment,
            checkList: cronTask.checkList,
            dueDate: dayjs().endOf("day").toDate(),
            createdBy: cronTask.createdBy,
            branch: cronTask.branch,
          },
        },
      });
    });
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Task.bulkWrite(taskBulkQueries, { session });
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
  }

  done();
});

const dailyTaskScheduler = async () => {
  await agenda.every("1 0 * * *", "Add task of the day");
};

exports.startAgenda = async () => {
  if (cluster.isMaster) {
    await agenda.start();
    await dailyTaskScheduler();
  }
};
