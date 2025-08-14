import React from "react";
import LoginSignup from "./LoginSignup";
import TimeDate from "./TimeDate";

function MainPage() {
  return (
    <div className="flex h-full">
      <section className="flex-1 hidden md:flex justify-center items-center">
        <TimeDate />
      </section>
      <section className="flex-1 bg-light20 backdrop-blur-xl md:rounded-tl-customLg md:rounded-bl-customLg">
        <div className="w-[80%] sm:w-[60%] md:w-[70%] lg:[60%] mx-auto mt-[8vh]">
          <LoginSignup />
        </div>
      </section>
    </div>
  );
}

export default MainPage;
