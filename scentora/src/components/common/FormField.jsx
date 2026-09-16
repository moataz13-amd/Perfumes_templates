import React from 'react';
import { cx } from '../../utils/helpers';

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = null,
  className = '',
  ...rest
}) {
  return (
    <div className={cx('form-field', error && 'form-field--error', className)}>
      {label && (
        <label className="form-field__label" htmlFor={name}>
          {label}
          {required && <span className="form-field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="form-field__input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${name}-error`} className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  placeholder = 'Select...',
  className = '',
}) {
  return (
    <div className={cx('form-field', className)}>
      {label && (
        <label className="form-field__label" htmlFor={name}>
          {label}
          {required && <span className="form-field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        className="form-field__select"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const v = typeof opt === 'string' ? opt : opt.value;
          const l = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  rows = 4,
  className = '',
}) {
  return (
    <div className={cx('form-field', className)}>
      {label && (
        <label className="form-field__label" htmlFor={name}>
          {label}
          {required && <span className="form-field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        className="form-field__textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
}) {
  return (
    <label className={cx('checkbox', disabled && 'is-disabled', className)}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="checkbox__input"
      />
      <span className="checkbox__box" />
      <span className="checkbox__label">{label}</span>
    </label>
  );
}