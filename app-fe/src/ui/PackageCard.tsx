import * as React from 'react';
import { Link } from 'react-router-dom';

import { PackageType } from '../interfaces/package';
import { Button } from './Button';
import './PackageCard.scss';

interface PackageCardProps extends PackageType {
  truncate?: boolean;
}

export const PackageCard: React.SFC<PackageCardProps> = ({
  id,
  name,
  title,
  version,
  license,
  depends,
  suggests,
  imports,
  truncate,
}) => {
  return (
    <div className="package-card">
      <div className="package-card--padded package-card--light-grey">
        <h2 className="package-card__name">{ name }</h2>
        <h3 className="package-card__title">{ title }</h3>
        <div className="package-card__button-container">
        <Link to={`/package/${id}`}>
          <Button>
            Version: { version }
          </Button>
        </Link>
        </div>
        <p className="package-card__text">License: { license }</p>
        {
          !truncate && (
            <>
              {
                depends && (
                  <>
                    Depends:
                    <ul className="package-card__text">
                      {
                        depends &&
                        depends.map((dependancy, index) => <li key={`depends-${index}`}>{ dependancy }</li>)
                      }
                    </ul>
                  </>
                )
              }
              {
                suggests && (
                  <>
                    Suggests:
                    <ul className="package-card__text">
                      {
                        suggests &&
                        suggests.map((suggestions, index) => <li key={`suggests-${index}`}>{ suggestions }</li>)
                      }
                    </ul>
                  </>
                )
              }
              {
                imports && (
                  <>
                    Imports:
                    <ul className="package-card__text">
                      {
                        imports &&
                        imports.map((_imports, index) => <li key={`imports-${index}`}>{ _imports }</li>)
                      }
                    </ul>
                  </>
                )
              }
            </>
          )
        }
      </div>
    </div>
  );
};