import * as React from 'react';
import './TextForm.scss';

interface TextFormProps {
  label: string;
  name: string;
  children?: any;
  value?: string;
  handleChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

export const TextForm: React.SFC<TextFormProps> = ({ children, label, name, value, handleChange}) => (
  <div className="text-form">
    <label className="text-form__label">{label}</label>
    <input
      className="text-form__input"
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      autoComplete="off"
    />
    { children }
  </div>
);
