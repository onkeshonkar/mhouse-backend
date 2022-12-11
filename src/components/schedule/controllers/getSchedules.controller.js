const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const dayjs = require("dayjs");
const { ObjectId } = require("mongoose").Types;

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
      employee: Joi.string().custom(customValidators.objectId),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  const { date, type, employee } = req.query;

  const weekStartDate = dayjs(date).day(0).toDate();
  const weekEndDate = dayjs(date).day(6).toDate();

  // send week schedule data for the employee

  if (employee) {
    const schedules = await Schedule.find({
      employee,
      scheduledDate: { $gte: weekStartDate, $lte: weekEndDate },
    });
    return res.json({ schedules });
  }

  if (!canAccess(req.user, "SCHEDULE_SHIFT", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const allEmployee = await Employee.find(
    { branch: branchId },
    "department jobTitle workSlot"
  )
    .populate({
      path: "user",
      select: ["fullName", "email", "avatar"],
    })
    .lean();

  if (type === "week") {
    // lean return POJO(Plain Old Java Object) not the instance of
    // Mongoose queries return an instance of the Mongoose Document class.
    // Documents are much heavier than vanilla JavaScript objects,

    const pipelineQuery = [
      {
        $match: {
          scheduledDate: { $gte: weekStartDate, $lte: weekEndDate },
          branch: ObjectId(branchId),
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
        ...employee,
        schedules: scheduleForEmp ? scheduleForEmp.weekData : [],
      };
    });

    return res.json({ employees: schedules });
  }

  // schedule list for single day of all employee

  const _schedules = await Schedule.find({
    branch: branchId,
    scheduledDate: date,
  }).lean();

  const employees = allEmployee.map((emp) => {
    const foundSchedule = _schedules.find(
      (sch) => sch.employee.toString() === emp._id.toString()
    );
    const employee = { ...emp, id: emp._id };
    delete employee._id;
    return {
      ...employee,
      schedule: foundSchedule || null,
    };
  });

  // _schedules.map((sch) => {
  //   const employee = {
  //     id: sch.employee._id.toString(),
  //     user: sch.employee.user,
  //     department: sch.employee.department,
  //     jobTitle: sch.employee.jobTitle,
  //     workSlot: sch.employee.workSlot,
  //   };
  //   delete sch.employee;
  //   employee.schedule = sch;
  //   employee.schedule.id = employee.schedule._id.toString();
  //   delete employee.schedule._id;

  //   employees.push(employee);
  // });
  // console.log(employees);

  return res.json({ employees });
};
