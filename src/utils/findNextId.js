const findNextId = (content) => {
  const maxId = content.reduce((acc, cur) => {
    if (cur.id > acc) return cur.id;
    return acc;
  }, 0);

  return maxId + 1;
};

module.exports = { findNextId };