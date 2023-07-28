const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_LIMIT_NUMBER = 10;
const DEFAULT_SORT_ORDER = "asc";
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = Number.MAX_SAFE_INTEGER;

function getPaginationSnippet(query) {
  const page = +query.page || DEFAULT_PAGE_NUMBER;
  const limit = +query.limit || DEFAULT_LIMIT_NUMBER;
  const offset = (page - 1) * limit;
  return (queryBuilder) => {
    queryBuilder.offset(offset).limit(limit);
  };
}

function getSortOptionsSnippet(query) {
  const sortBy = query.sortBy;
  const sortOrder = query.sortOrder || DEFAULT_SORT_ORDER;
  return (queryBuilder) => {
    if (sortBy) {
      queryBuilder.orderBy([{ column: sortBy, order: sortOrder }]);
    }
  };
}

function getSelectionRangeSnippet(query) {
  const minPrice = query.minPrice || DEFAULT_MIN_PRICE;
  const maxPrice = query.maxPrice || DEFAULT_MAX_PRICE;
  return (queryBuilder, tableName, columnName) => {
    const target = `${tableName}.${columnName}`;
    queryBuilder.where(target, ">=", minPrice).andWhere(target, "<=", maxPrice);
  };
}

function getQuerySnippets(query) {
  const pagination = getPaginationSnippet(query);
  const sort = getSortOptionsSnippet(query);
  const range = getSelectionRangeSnippet(query);
  return {
    pagination,
    sort,
    range,
  };
}

module.exports = { getQuerySnippets };
