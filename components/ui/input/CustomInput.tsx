import React from "react";

function CustomInput({
  children,
  label,
  htmlFor,
  className,
}: {
  readonly htmlFor: string;
  readonly label: string;
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor}>{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export default CustomInput;
