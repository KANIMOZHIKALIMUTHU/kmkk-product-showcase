import "./index.css";

const Pagination = ({ total = 0, page = 1, limit = 6, onPageChange }) => {
  // FORCE ALL PROPS TO NUMBERS - NO CRASHES
  const safeTotal = Number(total) || 0;
  const safePage = Number(page) || 1;
  const safeLimit = Number(limit) || 6;
  
  const totalPages = Math.ceil(safeTotal / safeLimit);
  
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  const pages = [];
  let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  return (
    <nav className="pagination" aria-label="Products pagination">
      <button
        type="button"
        className="pagination-btn pagination-nav"
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage === 1}
      >
        ‹ Previous
      </button>

      {pages[0] > 1 && (
        <>
          <button type="button" className="pagination-btn" onClick={() => onPageChange(1)}>
            1
          </button>
          {pages[0] > 2 && <span className="pagination-ellipsis">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`pagination-btn ${p === safePage ? 'pagination-btn-active' : ''}`}
          onClick={() => onPageChange(p)}
          aria-current={p === safePage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="pagination-ellipsis">…</span>
          )}
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        className="pagination-btn pagination-nav"
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage === totalPages}
      >
        Next ›
      </button>
    </nav>
  );
};

export default Pagination;
