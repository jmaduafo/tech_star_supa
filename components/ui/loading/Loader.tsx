import { LoaderCircle } from "lucide-react";
import React from "react";

function Loader() {
  return (
    <main className="h-screen w-full flex items-center justify-center bg-background bg-lightText text-darkText">
      {/* Loading spinner or skeleton */}
      <div className="animate-spin">
        <LoaderCircle className="w-10 h-10" strokeWidth={1.5} />
      </div>
    </main>
  );
}

export default Loader;
