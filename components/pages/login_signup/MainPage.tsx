import React from "react";
import LoginSignup from "./LoginSignup";
import Image from "next/image";
import Logo from "../../../public/images/logo.png";

function MainPage() {
  return (
    <div className="flex h-full p-4">
      <section className="flex-1 hidden md:flex justify-center items-center">
        <div
          style={{
            backgroundImage: "url(../images/login-signup.jpg)",
          }}
          className="rounded-2xl bg-cover bg-center bg-no-repeat w-full h-full object-cover object-bottom overflow-hidden"
        >
        </div>
      </section>
      <section className="flex-1 md:rounded-tl-customLg md:rounded-bl-customLg">
        <div className="flex justify-end">
        <div className="w-7 h-7 object-cover object-center">
          <Image src={Logo} alt="techstar logo" className="w-full h-full"/>
        </div>
      </div>
        <div className="w-[80%] sm:w-[60%] md:w-[70%] lg:[60%] mx-auto mt-[8vh]">
          <LoginSignup />
        </div>
      </section>
    </div>
  );
}

export default MainPage;
