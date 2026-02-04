import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export default function SecondaryButton({ label, ...props }: Props) {
  return (
    <button className="btn btn-secondary" {...props}>
      {label}
    </button>
  );
}
