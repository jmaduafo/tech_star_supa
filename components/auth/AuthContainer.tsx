import React from 'react'
import Navbar from '../ui/navbar/Navbar';

function AuthContainer({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className='h-full relative'>
      <div className="absolute inset-0 bg-lightText/5 -z-0"></div>
      <div className="p-5 md:p-8 relative">
        <Navbar />
        <div className="mt-8 h-full w-full sm:w-[95%] lg:w-[90%] 2xl:w-[70%] mx-auto">{children}</div>
      </div>
    </div>
  );
}

export default AuthContainer