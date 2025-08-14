import React from 'react'

function NotAvailable({ text }: { readonly text: string}) {
  return (
    <div className='h-full flex justify-center items-center'><p className='text-[16px]'>{text}</p></div>
  )
}

export default NotAvailable