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
  placeholder,
}: {
  readonly htmlFor: string;
  readonly label: string;
  readonly className?: string;
  readonly type: React.HTMLInputTypeAttribute | undefined;
  readonly name?: string;
  readonly id?: string;
  readonly placeholder?: string;
  readonly value: string | number | readonly string[] | undefined;
  readonly onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor}>{label}</label>
      <input
        type={type}
        className="bg-lightText/50 text-darkText rounded-[10px] px-3 py-2.5 text-base placeholder-darkText/65 mt-2"
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        id={id}
      />
    </div>
  );
}

export default Input