import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export default function PrimaryButton({ label, ...props }: Props) {
  return (
    <button className="btn btn-primary" {...props}>
      {label}
    </button>
  );
}
