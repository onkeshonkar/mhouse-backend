const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const dayjs = require("dayjs");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Schedule = require("../../../models/Schedule.model");
const Employee = require("../../../models/Employee.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    query: Joi.object({
      date: Joi.date().required(),
      type: Joi.string().valid("week", "day").required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  const { date, type } = req.query;

  if (!canAccess(req.user, "SCHEDULE_SHIFT", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const weekStartDate = dayjs(date).day(0).toDate();
  const weekEndDate = dayjs(date).day(6).toDate();

  const allEmployee = await Employee.find(
    { branch: branchId },
    "department jobTitle workSlot"
  )
    .populate({
      path: "user",
      select: ["fullName", "email", "avatar"],
    })
    .lean();
  // lean return POJO(Plain Old Java Object) not the instance of
  // Mongoose queries return an instance of the Mongoose Document class.
  // Documents are much heavier than vanilla JavaScript objects,

  if (type === "week") {
    const pipelineQuery = [
      {
        $match: {
          scheduledDate: { $gte: weekStartDate, $lte: weekEndDate },
          branch: branchId,
        },
      },
      {
        $group: {
          _id: "$employee",
          weekData: {
            $push: {
              id: "$_id",
              scheduledSlot: "$scheduledSlot",
              breakTime: "$breakTime",
              scheduledDate: "$scheduledDate",
              published: "$published",
              leaveType: "$leaveType",
            },
          },
        },
      },
    ];

    const _schedules = await Schedule.aggregate(pipelineQuery);

    const schedules = allEmployee.map((emp) => {
      const scheduleForEmp = _schedules.find(
        (sch) => sch._id.toString() === emp._id.toString()
      );
      const employee = { ...emp, id: emp._id };
      delete employee._id;
      return {
        employee,
        weekData: scheduleForEmp ? scheduleForEmp.weekData : [],
      };
    });

    return res.json({ schedules });
  }

  const _schedules = await Schedule.find({
    branch: branchId,
    scheduledDate: date,
  }).populate({
    path: "employee",
    select: ["department", "jobTitle", "workSlot", "user"],
    populate: {
      path: "user",
      model: "User",
      select: ["fullName", "email", "avatar"],
    },
  });

  return res.json({ schedules: _schedules });
};
