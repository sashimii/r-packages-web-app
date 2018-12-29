import * as React from 'react';
import './Status.scss';

interface StatusProps {
  colour: string;
  children: string;
}

export const Status: React.SFC<StatusProps> = ({ children, colour }) => {
  return (
    <span className={`status status__text status--${colour}`}>
      {children}
    </span>
  );
};
