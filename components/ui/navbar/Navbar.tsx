import React from "react";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

function Navbar() {
  return (
    <header className="">
      <TopBar />
      <div className="mt-2 bg-light25 py-1 px-1 mx-auto w-fit rounded-full backdrop-blur-[100px]">
        <BottomBar />
      </div>
    </header>
  );
}

export default Navbar;
