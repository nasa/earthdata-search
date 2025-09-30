/**
 * Builds pagination metadata from query results
 * @param {Object} params - Parameters object
 * @param {Array} params.data - Query results
 * @param {number} params.limit - Items per page
 * @param {number} params.offset - Current offset
 * @returns {Object} Paginated result structure
 */
export default function buildPaginatedResult({ data, limit, offset }) {
  const count = data.length ? data[0].total : 0
  const pageCount = Math.ceil(count / limit) || 0
  const currentPage = pageCount > 0 ? Math.floor(offset / limit) + 1 : null

  return {
    data,
    pageInfo: {
      pageCount,
      hasNextPage: currentPage < pageCount,
      hasPreviousPage: currentPage > 1,
      currentPage
    },
    count
  }
}
