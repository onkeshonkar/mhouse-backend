const mongoose = require("mongoose");
const Branch = require("./models/Branch.model");
const Notification = require("./models/Notification.model");
const User = require("./models/User.model");
const { validateAuthToken } = require("./services/token.service");

let io;

let activeUsers = {};

exports.initIO = (IOInstance) => {
  io = IOInstance;
};

/**
 * @summary notify branch Manager and owner of the restaurent(main branch)
 * @requires user must have branch.restaurent(id) key
 */

exports.notifyAdmins = async ({ user, module, message }) => {
  const manager = await User.findOne({
    branch: user.branch.id,
    type: "MANAGER",
  }).select(["fullName", "type", "branch"]);

  const mainBranch = await Branch.findOne({
    restaurent: user.branch.restaurent,
    isMainBranch: true,
  }).select(["name", "manager", "isMainBranch"]);

  const owner = await User.findOne({
    branch: mainBranch.id,
    type: "OWNER",
  }).select(["fullName", "type"]);

  for (const admin of [manager, owner]) {
    if (admin) {
      let notification = await Notification.create({
        triggeredBy: user.id,
        message,
        module,
        triggeredFor: admin.id,
      });

      for (let socket of activeUsers[admin.id]) {
        socket.emit("notification", {
          message,
          module,
          triggeredBy: {
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
          },
          createdAt: notification.createdAt,
        });
      }
    }
  }
};

exports.notifyOwner = async ({ user, module, message }) => {
  const owner = await User.findOne({
    branch: user.branch.id,
    type: "OWNER",
  }).select(["fullName", "type"]);

  const notification = await Notification.create({
    triggeredBy: user.id,
    message,
    module,
    triggeredFor: owner.id,
  });

  for (let socket of activeUsers[owner.id]) {
    socket.emit("notification", {
      message,
      module,
      triggeredBy: {
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
      createdAt: notification.createdAt,
    });
  }
};

exports.notifyAll = async ({ user, module, message }) => {
  // create notifications for each employee in the branch
  const users = await User.find({
    branch: user.branch.id,
  }).select(["fullName", "type", "branch"]);

  const bulkWrite = users.map((u) => ({
    triggeredBy: user.id,
    message,
    module,
    triggeredFor: u.id,
  }));

  await Notification.insertMany(bulkWrite);

  // broadcast in the room of branch Id

  io.to(user.branch.id).emit("notification", {
    message,
    module,
    triggeredBy: {
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    },
    createdAt: new Date(),
  });

  // users.forEach((u) => {
  //   for (let socket of activeUsers[u.id]) {
  //     socket.emit("notification", {
  //       message,
  //       module,
  //       triggeredBy: {
  //         fullName: user.fullName,
  //         email: user.email,
  //         avatar: user.avatar,
  //       },
  //       createdAt: new Date(),
  //     });
  //   }
  // });
};

exports.onConnection = async (socket) => {
  socket.join(socket.user.branchId);

  const userId = socket.user.id;

  if (!activeUsers.hasOwnProperty(userId)) {
    activeUsers[userId] = [socket];
  } else {
    activeUsers[userId].push(socket);
  }

  const notifications = await Notification.find({
    triggeredFor: socket.user.id,
  })
    .populate("triggeredBy", ["fullName", "email", "avatar"])
    .sort({ createdAt: -1 });

  socket.emit("old notifications", notifications);

  socket.on("mark all read", async (arg) => {
    await Notification.updateMany(
      { triggeredFor: socket.user.id },
      { isRead: true }
    );
  });

  socket.on("disconnect", (reason) => {
    socket.leave(socket.user.branchId);

    console.log("socket closed", socket.id);

    //  get all active sockets of current socket userId
    let userSocketList = activeUsers[socket.user.id];

    // filter out current socket
    activeUsers[socket.user.id] = userSocketList.filter(
      (s) => s.id !== socket.id
    );

    //  delete the userId key if have no active connection
    if (!userSocketList.length) {
      delete activeUsers[socket.user.id];
    }
  });
};

exports.authMiddleware = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("invalid auth token"));
  }
  const { user, valid } = await validateAuthToken(token);

  if (!valid) {
    return next(new Error("invalid auth token"));
  }

  socket.user = {
    id: user.id,
    type: user.type,
    email: user.email,
    branchId: user.branch.id,
  };
  next();
};
