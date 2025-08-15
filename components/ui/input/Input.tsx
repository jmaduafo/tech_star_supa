import React from "react";

function Input({
  label,
  htmlFor,
  className,
  type,
  value,
  name,
  id,
  onChange,
}: {
  readonly htmlFor: string;
  readonly label: string;
  readonly className?: string;
  readonly type: React.HTMLInputTypeAttribute | undefined;
  readonly name: string;
  readonly id: string;
  readonly value: string | number | readonly string[] | undefined;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        type={type}
        className="form"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
      />
    </div>
  );
}

export default Input;
