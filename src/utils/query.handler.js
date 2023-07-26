const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_LIMIT_NUMBER = 10;

function getPagination(query) {
  const page = +query.page || DEFAULT_PAGE_NUMBER;
  const limit = +query.limit || DEFAULT_LIMIT_NUMBER;
  const offset = (page - 1) * limit;
  return { offset, limit };
}

module.exports = { getPagination };
