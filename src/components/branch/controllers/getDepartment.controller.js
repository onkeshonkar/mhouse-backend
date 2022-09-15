require("express-async-errors");

const Branch = require("../../../models/Branch.model");

module.exports = async (req, res, next) => {
  const { branchId } = req.params;

  const branch = await Branch.findById(branchId).select({
    departments: 1,
    restaurent: 1,
  });

  return res.json({ departments: branch.departments });
};
