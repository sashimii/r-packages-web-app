import * as React from 'react';
import './AuthorBadge.scss';

import { Link } from 'react-router-dom';
import { AuthorType } from '../interfaces/author';
import { PackageCard } from './PackageCard';

interface AuthorBadgeProps extends AuthorType {}

export const AuthorBadge: React.SFC<AuthorBadgeProps> = ({
  id,
  name,
  email,
  packages,
}) => {
  return (
    <div className="author-badge author-badge__grey-background">
      <h4>
        <Link to={`/author/${id}`}>
          {name}
        </Link>
      </h4>

      <p>{ email }</p>
      <p>
        {
          packages &&
          packages.map((rPackage, index) => <PackageCard key={`package-card-${index}`} {...rPackage} /> )
        }
      </p>
    </div>
  );
};