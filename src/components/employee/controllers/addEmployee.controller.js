const httpStatus = require("http-status");
const Joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const canAccess = require("../../../utils/canAccess");

const Employee = require("../../../models/Employee.model");
const User = require("../../../models/User.model");
const Restaurent = require("../../../models/Restaurent.model");
const { notifyAdmins } = require("../../../socketIO");
const { sendInvitationEmail } = require("../../../services/email.service");
const { generateInvitationToken } = require("../../../services/token.service");

module.exports = async (req, res, next) => {
  const visaSchema = Joi.object({
    type: Joi.string()
      .valid(
        "Student Visa(20hrs limit)",
        "Student Visa(non restricted)",
        "Temporary Work Visa",
        "PR",
        "Citizen"
      )
      .required(),
    expiryDate: Joi.date().optional(),
  });

  const tenureSchema = Joi.object({
    period: Joi.string().valid("Day", "Month", "Year").required(),
    duration: Joi.number().required(),
  });

  const emergencyContactSchema = Joi.object({
    fullName: Joi.string().trim().required(),
    phoneNumber: Joi.string()
      .custom(customValidators.phoneNumber)
      .trim()
      .required(),
    relation: Joi.string().trim().required(),
  });

  const experienceSchema = Joi.object({
    companyName: Joi.string().trim(),
    department: Joi.string().trim(),
    jobTitle: Joi.string().trim(),
    startDate: Joi.date(),
    endDate: Joi.date(),
  });

  const schema = {
    body: Joi.object({
      fullName: Joi.string().trim().required(),
      dateOfBirth: Joi.date().required(),
      //   avatar:
      email: Joi.string().lowercase().email().trim().required(),
      phoneNumber: Joi.string().custom(customValidators.phoneNumber).required(),
      gender: Joi.string().valid("Male", "Female", "Others").required(),

      fullAddress: Joi.string().required(),
      branch: Joi.string().custom(customValidators.objectId).required(),
      department: Joi.string().trim().required(),
      jobTitle: Joi.string().trim().required(),
      employementType: Joi.string().valid("FullTime", "PartTime", "Casual"),
      tenure: tenureSchema.required(),

      visa: visaSchema.required(),
      payrollGroup: Joi.string().custom(customValidators.objectId).required(),

      workSlot: Joi.array()
        .items(
          Joi.array().items(Joi.string().custom(customValidators.time)).max(2)
        )
        .length(7)
        .custom(customValidators.workSlot)
        .required(),

      emergencyContact: emergencyContactSchema,
      experience: experienceSchema,
      //   resumeUrl:
    }),
  };

  validateSchema(req, schema);

  const {
    fullName,
    dateOfBirth,
    email,
    phoneNumber,
    branch,
    gender,
    fullAddress,
    department,
    jobTitle,
    employementType,
    tenure,
    visa,
    payrollGroup,
    workSlot,
    emergencyContact,
    experience,
  } = req.body;

  if (!canAccess(req.user, "WORKFORCE", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const _restaurent = await Restaurent.findByIdAndUpdate(
      req.user.restaurent,
      {
        $inc: { payrollId: 1, employeeId: 1 },
      },
      { new: true, session: session }
    ).select({
      payrollId: 1,
      employeeId: 1,
      businessName: 1,
      venueName: 1,
    });

    const _user = await User.create(
      [
        {
          fullName,
          dateOfBirth,
          email,
          phoneNumber,
          branch,
          type: "STAFF",
        },
      ],
      { session }
    );

    const employee = await Employee.create(
      [
        {
          employeeId: _restaurent.employeeId,
          payrollId: _restaurent.payrollId,
          user: _user[0].id,
          gender,
          fullAddress,
          department,
          jobTitle,
          employementType,
          tenure,
          visa,
          payrollGroup,
          workSlot,
          emergencyContact,
          experience,
          branch,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // send invitation email to emp
    const invitationToken = await generateInvitationToken(employee);

    sendInvitationEmail(
      _user[0],
      invitationToken,
      _restaurent.businessName || _restaurent.venueName
    ).then(() => {
      console.log("email sent sucessfully.......................");
    });

    if (req.user.type !== "OWNER") {
      notifyAdmins({
        user: req.user,
        module: "Workforce",
        message: `New workforce is added ${email}`,
      });
    }

    res.json({ employee: employee[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error?.keyValue?.email)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `EMAIL ${error?.keyValue?.email} is already registered!`
      );

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
