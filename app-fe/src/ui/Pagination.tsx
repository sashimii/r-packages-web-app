import * as React from 'react';
import { Link } from 'react-router-dom';

import './Pagination.scss';

interface PaginationProps {
  pages: number[];
  selected: number;
}

export const Pagination: React.SFC<PaginationProps> = ({pages, selected}) => {
  return (
    <div className="pagination">
      <ul className="pagination__list">
        {
          pages.map(pageNum => {
            return (
              <li
                key={`page-${pageNum}`}
                className={`pagination__number pagination--selected-${pageNum === selected}`}
              >
                <Link to={`/package-list/?page=${pageNum}`}>{pageNum}</Link>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};