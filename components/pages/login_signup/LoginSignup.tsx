"use client";

import React, { useState } from "react";
import FormSwitch from "./FormSwitch";
import Login from "./Login";
import SignUp from "./SignUp";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div>    
      <div className="">
        <FormSwitch isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
      <div className="mt-[5em] xs:mt-[7.5em] duration-300">
        {isLogin ? <Login /> : <SignUp />}
      </div>
    </div>
  );
}

export default LoginSignup;
