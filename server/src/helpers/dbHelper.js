const paginate = (query, { page, pageSize }) => {
  const offset = page * pageSize
  const limit = offset + pageSize

  return {
    ...query,
    offset,
    limit
  }
}

module.exports = { paginate }
