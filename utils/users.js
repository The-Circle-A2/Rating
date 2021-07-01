const users = [];

function userJoin(id, username, stream) {
  const user = { id, username, stream };

  users.push(user);

  return user;
}

function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getStreamUsers(stream) {
  return users.filter(user => user.stream === stream);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getStreamUsers
};
