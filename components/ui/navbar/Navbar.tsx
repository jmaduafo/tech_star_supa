import React from "react";
import TopBar from "./TopBar";

function Navbar() {
  return (
    <header className="sticky top-0 py-3 z-50 bg-background">
      <TopBar />
      {/* <div className="mt-2 bg-light35 py-1 px-1 mx-auto w-fit rounded-full backdrop-blur-[100px]">
        <BottomBar />
      </div> */}
    </header>
  );
}

export default Navbar;
