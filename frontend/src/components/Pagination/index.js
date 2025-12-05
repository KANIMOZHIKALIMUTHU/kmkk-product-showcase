// components/Pagination/index.js
import "./index.css";

const Pagination = ({ total, page, limit, onPageChange }) => {
  const totalPages = Math.ceil((total || 0) / (limit || 1));
  if (totalPages <= 1) return null;

  const maxVisible = 5;

  const getVisiblePages = () => {
    const pages = [];
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let p = start; p <= end; p += 1) {
      pages.push(p);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="pagination" aria-label="Products pagination">
      <button
        type="button"
        className="pagination-btn pagination-nav"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        ‹ Previous
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {visiblePages[0] > 2 && <span className="pagination-ellipsis">…</span>}
        </>
      )}

      {visiblePages.map((p) => (
        <button
          key={p}
          type="button"
          className={`pagination-btn ${
            p === page ? 'pagination-btn-active' : ''
          }`}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
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
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next ›
      </button>
    </nav>
  );
};

export default Pagination;
