import * as React from 'react';
import './Button.scss';

interface ButtonProps {
  children: any;
  disabled?: boolean;
}

export const Button: React.SFC<ButtonProps> = ({ children, disabled }) => {
  return (
    <button
      className="button button__text button--orange"
      disabled={disabled}
    >
      {children}
    </button>
  );
};