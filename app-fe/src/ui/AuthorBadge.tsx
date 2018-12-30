import * as React from 'react';

import { Link } from 'react-router-dom';
import { AuthorType } from '../interfaces/author';

import './AuthorBadge.scss';

interface AuthorBadgeProps extends AuthorType {
  showPackages?: boolean;
}

export const AuthorBadge: React.SFC<AuthorBadgeProps> = ({
  id,
  name,
  email,
  packages,
  showPackages,
}) => {
  return (
    <div className="author-badge">
      <div className="author-badge--padded author-badge--light-grey">
        <h4 className="author-badge__name">
          <Link to={`/author/${id}`}>
            {name}
          </Link>
        </h4>
        {
          email && (
            <>
              <h5 className="author-badge__email">Email:</h5>
              <a href={`mailto:${email}`}> { email }</a>
            </>
          )
        }
      </div>
    </div>
  );
};