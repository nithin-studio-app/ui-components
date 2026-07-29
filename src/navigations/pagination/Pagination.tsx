import { ChevronLeftIcon, ChevronRightIcon } from "../../data-display/icons";
import { getPageItems } from "./getPageItems";
import "./Pagination.css";

export type PaginationSize = "small" | "medium";

export interface PaginationProps {
  count: number;
  /** 1-indexed current page. */
  page: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  size?: PaginationSize;
  disabled?: boolean;
  "aria-label"?: string;
}

export function Pagination({
  count,
  page,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  size = "medium",
  disabled = false,
  "aria-label": ariaLabel = "pagination",
}: PaginationProps) {
  const items = getPageItems(count, page, siblingCount, boundaryCount);

  return (
    <nav aria-label={ariaLabel}>
      <ul className={`pagination pagination-${size}`}>
        <li>
          <button
            type="button"
            className="pagination-nav"
            aria-label="Previous page"
            disabled={disabled || page <= 1}
            onClick={() => onChange(page - 1)}
          >
            <ChevronLeftIcon />
          </button>
        </li>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${index}`} className="pagination-ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={`pagination-page${item === page ? " pagination-page-current" : ""}`}
                aria-current={item === page ? "page" : undefined}
                aria-label={item === page ? `Page ${item}, current page` : `Go to page ${item}`}
                disabled={disabled}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className="pagination-nav"
            aria-label="Next page"
            disabled={disabled || page >= count}
            onClick={() => onChange(page + 1)}
          >
            <ChevronRightIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
}
