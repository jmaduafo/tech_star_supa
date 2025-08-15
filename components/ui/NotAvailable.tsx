import React from "react";

function NotAvailable({ text }: { readonly text: string }) {
  return (
    <div className="h-full w-full flex justify-center items-center mt-6">
      <p className="text-base">{text}</p>
    </div>
  );
}

export default NotAvailable;
