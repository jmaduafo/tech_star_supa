import React from 'react'
import Navbar from '../ui/navbar/Navbar';

function AuthContainer({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className='h-full'>
      <div className="w-full h-full fixed bg-light10 -z-0"></div>
      <div className="p-5 md:p-10 relative">
        <Navbar />
        <div className="mt-8 h-full w-full sm:w-[95%] 2xl:w-[60%] mx-auto">{children}</div>
      </div>
    </div>
  );
}

export default AuthContainer