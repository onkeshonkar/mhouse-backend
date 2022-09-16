const canAccess = (user, resource, accessType) => {
  if (user.type === "OWNER") return true;

  resource = resource.toUpperCase();
  accessType = accessType.toLowerCase();

  if (user.roles && user.roles.access.resource.includes(accessType))
    return true;

  return false;
};

module.exports = canAccess;
