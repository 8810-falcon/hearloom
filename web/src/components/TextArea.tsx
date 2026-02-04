import React from 'react';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  error?: string;
};

export default function TextArea({
  label,
  placeholder,
  value,
  onChange,
  helper,
  error,
}: Props) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <textarea
        className={error ? 'textarea input-error' : 'textarea'}
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <p className="field-error">{error}</p>
      ) : helper ? (
        <p className="field-helper">{helper}</p>
      ) : null}
    </div>
  );
}
